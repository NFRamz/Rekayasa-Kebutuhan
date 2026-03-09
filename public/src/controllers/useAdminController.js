export const useAdminController = (alumniDB, setAlumniDB) => {
  const pendingData = alumniDB.filter(a => a.status === 'Menunggu Verifikasi');

  const verifyAlumni = (id, isValid) => {
    if(isValid) {
      setAlumniDB(alumniDB.map(a => a.id === id ? { ...a, status: 'Terverifikasi' } : a));
    } else {
      setAlumniDB(alumniDB.filter(a => a.id !== id));
    }
  };

  return { pendingData, verifyAlumni };
};
