import { useState } from 'react';

export const usePencarianController = (alumniDB) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [internalResults, setInternalResults] = useState([]);
  const [externalResults, setExternalResults] = useState([]);

  const executeSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    setIsSearching(true);

    const filteredDB = alumniDB.filter(a => 
      a.status === 'Terverifikasi' && 
      (a.nama.toLowerCase().includes(query.toLowerCase()) || a.prodi.toLowerCase().includes(query.toLowerCase()))
    );
    
    // Simulasi delay API
    setTimeout(() => {
      setInternalResults(filteredDB);
      const mockExternal = [
        { source: 'PDDIKTI API', title: `Data Mahasiswa Lulus: ${query}`, desc: `Lulusan Informatika. Status: Lulus.`, link: '#' },
        { source: 'LinkedIn API', title: `${query} - Profesional`, desc: `Bekerja di industri teknologi.`, link: '#' }
      ];
      setExternalResults(mockExternal);
      setIsSearching(false);
    }, 1500);
  };

  return { query, setQuery, isSearching, internalResults, externalResults, executeSearch };
};
