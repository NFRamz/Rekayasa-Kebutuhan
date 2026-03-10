import { useState } from 'react';

// Konfigurasi API Publik dari Environment (dengan fallback/default URL jika env kosong)
const API_PDDIKTI = import.meta.env.VITE_API_PDDIKTI;
const API_GITHUB = import.meta.env.VITE_API_GITHUB;
const API_GOOGLE_IMG = import.meta.env.VITE_API_GOOGLE_IMG;
const API_ORCID = import.meta.env.VITE_API_ORCID;

export const usePencarianController = (alumniDB) => {
  const [queryNama, setQueryNama] = useState('');
  const [queryAfiliasi, setQueryAfiliasi] = useState('');
  const [queryKonteks, setQueryKonteks] = useState('');
  
  const [isSearching, setIsSearching] = useState(false);
  const [internalResults, setInternalResults] = useState([]);
  const [externalResults, setExternalResults] = useState([]);

  const executeSearch = async (e) => {
    e.preventDefault();
    if (!queryNama) return;
    setIsSearching(true);
    setExternalResults([]);

    const filteredDB = alumniDB.filter(a => 
      a.status === 'Terverifikasi' && 
      a.nama.toLowerCase().includes(queryNama.toLowerCase())
    );
    setInternalResults(filteredDB);
    
    let fetchedExternal = [];
    const combinedQuery = `${queryNama} ${queryKonteks} ${queryAfiliasi}`.trim();
    const q = encodeURIComponent(combinedQuery);
    
    try {
      const [pddiktiRes, githubRes, googleRes, orcidRes] = await Promise.allSettled([
        fetch(`${API_PDDIKTI}?query=${encodeURIComponent(queryNama)}`).then(res => res.json()),
        fetch(`${API_GITHUB}?q=${encodeURIComponent(queryNama)}`).then(res => res.json()),
        fetch(`${API_GOOGLE_IMG}?query=${q}`).then(res => res.json()),
        fetch(`${API_ORCID}?q=${encodeURIComponent(queryNama)}`, { headers: { 'Accept': 'application/json' } }).then(res => res.text())
      ]);

      if (pddiktiRes.status === 'fulfilled' && Array.isArray(pddiktiRes.value)) {
        pddiktiRes.value.slice(0, 3).forEach(item => {
          fetchedExternal.push({ source: 'PDDIKTI', title: item.nama, desc: `Kampus: ${item.nama_pt} | Prodi: ${item.nama_prodi} | NIM: ${item.nim}`, link: '#' });
        });
      }

      if (githubRes.status === 'fulfilled' && githubRes.value.items) {
        githubRes.value.items.slice(0, 3).forEach(item => {
          fetchedExternal.push({ source: 'GitHub', title: `@${item.login}`, desc: `Profil Developer`, link: item.html_url, image: item.avatar_url });
        });
      }

      if (googleRes.status === 'fulfilled' && Array.isArray(googleRes.value)) {
        googleRes.value.slice(0, 3).forEach(item => {
          fetchedExternal.push({ source: 'Google Web', title: item.title, desc: item.url, link: item.url, image: item.image });
        });
      }

      if (orcidRes.status === 'fulfilled' && orcidRes.value) {
        try {
          const data = JSON.parse(orcidRes.value);
          if (data && data.result) {
            data.result.slice(0, 2).forEach(item => fetchedExternal.push({ source: 'ORCID', title: 'Profil Peneliti', desc: item['orcid-identifier'].path, link: item['orcid-identifier'].uri }));
          }
        } catch(e) {}
      }
    } catch (error) {
      console.error("Error API:", error);
    } finally {
      setExternalResults(fetchedExternal);
      setIsSearching(false);
    }
  };

  return { queryNama, setQueryNama, queryAfiliasi, setQueryAfiliasi, queryKonteks, setQueryKonteks, isSearching, internalResults, externalResults, executeSearch };
};
