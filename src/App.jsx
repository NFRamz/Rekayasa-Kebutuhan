import React, { useState } from 'react';
import { Search, MapPin, FileText, ShieldCheck, Lock, User, LogOut, Users } from 'lucide-react';


 import { useAppModel } from './models/useAppModel';
 import PencarianView from './views/PencarianView';
 import PetaView from './views/PetaView';
 import PendataanView from './views/PendataanView';
 import AdminView from './views/AdminView';
 import DaftarPenggunaView from './views/DaftarPenggunaView';


// --- KOMPONEN LOGIN SCREEN (MENGGUNAKAN DESAIN GLASSMORPHISM ANDA) ---
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kredensial untuk Dosenaa
    if (username === 'naufal2023026' && password === 'admin123') {
      onLogin(true);
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <>
      {/* CSS Persis seperti yang Anda berikan (di-scope agar tidak merusak Tailwind di Dashboard) */}
      <style>{`
        .login-theme * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Poppins", sans-serif;
        }

        .login-theme section {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .login-theme section .bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }

        .login-theme section .trees {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 100;
          pointer-events: none;
        }

        .login-theme section .girl {
          position: absolute;
          scale: 0.35;
          pointer-events: none;
          animation: animateGirl 28s linear infinite;
        }

        @keyframes animateGirl {
          0% {
            transform: translateX(calc(100% + 100vw));
          }
          50% {
            transform: translateX(calc(-100% - 100vw));
          }
          50.01% {
            transform: translateX(calc(-100% - 100vw)) rotateY(180deg);
          }
          100% {
            transform: translateX(calc(100% + 100vw)) rotateY(180deg);
          }
        }

        .login-theme .login {
          position: relative;
          padding: 60px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(15px);
          border: 1px solid #fff;
          border-bottom: 1px solid rgba(255, 255, 255, 0.5);
          border-right: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          width: 500px;
          display: flex;
          flex-direction: column;
          gap: 30px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
        }

        .login-theme .login h2 {
          position: relative;
          width: 100%;
          text-align: center;
          font-size: 2.5em;
          font-weight: 600;
          color: #8f2c24;
          margin-bottom: 10px;
        }

        .login-theme .login .inputBox {
          position: relative;
        }

        .login-theme .login .inputBox input {
          position: relative;
          width: 100%;
          padding: 15px 20px;
          outline: none;
          font-size: 1.25em;
          color: #8f2c24;
          border-radius: 5px;
          background: #fff;
          border: none;
          margin-bottom: 30px;
        }

        .login-theme .login .inputBox ::placeholder {
          color: #8f2c24;
        }

        .login-theme .login .inputBox #btn {
          position: relative;
          border: none;
          outline: none;
          background: #8f2c24;
          color: #fff;
          cursor: pointer;
          font-size: 1.25em;
          font-weight: 500;
          transition: 0.5s;
        }

        .login-theme .login .inputBox #btn:hover {
          background: #d64c42;
        }

        .login-theme .login .group {
          display: flex;
          justify-content: space-between;
        }

        .login-theme .login .group a {
          font-size: 1.25em;
          color: #8f2c24;
          font-weight: 500;
          text-decoration: none;
        }

        .login-theme .login .group a:nth-child(2) {
          text-decoration: underline;
        }

        .login-theme .leaves {
          position: absolute;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
          pointer-events: none;
        }

        .login-theme .leaves .set {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .login-theme .leaves .set div {
          position: absolute;
          display: block;
        }

        .login-theme .leaves .set div:nth-child(1) {
          left: 20%;
          animation: animate 20s linear infinite;
        }

        .login-theme .leaves .set div:nth-child(2) {
          left: 50%;
          animation: animate 14s linear infinite;
        }

        .login-theme .leaves .set div:nth-child(3) {
          left: 70%;
          animation: animate 12s linear infinite;
        }

        .login-theme .leaves .set div:nth-child(4) {
          left: 5%;
          animation: animate 15s linear infinite;
        }

        .login-theme .leaves .set div:nth-child(5) {
          left: 85%;
          animation: animate 18s linear infinite;
        }

        .login-theme .leaves .set div:nth-child(6) {
          left: 90%;
          animation: animate 12s linear infinite;
        }

        .login-theme .leaves .set div:nth-child(7) {
          left: 15%;
          animation: animate 14s linear infinite;
        }

        .login-theme .leaves .set div:nth-child(8) {
          left: 60%;
          animation: animate 15s linear infinite;
        }

        @keyframes animate {
          0% {
            opacity: 0;
            top: -10%;
            transform: translateX(20px) rotate(0deg);
          }
          10% {
            opacity: 1;
          }
          20% {
            transform: translateX(-20px) rotate(45deg);
          }
          40% {
            transform: translateX(-20px) rotate(90deg);
          }
          60% {
            transform: translateX(20px) rotate(180deg);
          }
          80% {
            transform: translateX(-20px) rotate(45deg);
          }
          100% {
            top: 110%;
            transform: translateX(20px) rotate(225deg);
          }
        }
      `}</style>

      {/* HTML Persis seperti struktur Anda */}
      <div className="login-theme">
        <section>
          <div className="leaves">
            <div className="set">
              <div><img src="leaf_01.png" alt="" /></div>
              <div><img src="leaf_02.png" alt="" /></div>
              <div><img src="leaf_03.png" alt="" /></div>
              <div><img src="leaf_04.png" alt="" /></div>
              <div><img src="leaf_01.png" alt="" /></div>
              <div><img src="leaf_02.png" alt="" /></div>
              <div><img src="leaf_03.png" alt="" /></div>
              <div><img src="leaf_04.png" alt="" /></div>
            </div>
          </div>
          <img src="bg.jpg" className="bg" alt="" />
          <img src="girl.png" className="girl" alt="" />
          <img src="trees.png" className="trees" alt="" />
          <div className="login">
            <h2>Alumni Tracker</h2>
            {/* Pesan error custom untuk salah password */}
            {error && <p style={{ color: '#fff', backgroundColor: '#8f2c24', padding: '10px', borderRadius: '5px', fontSize: '14px', textAlign: 'center', marginTop: '-15px', marginBottom: '-10px' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="inputBox">
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
              <div className="inputBox">
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="inputBox">
                <input type="submit" value="Login" id="btn" />
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}

// --- KOMPONEN UTAMA ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('daftar_alumni'); // Default ke daftar pengguna
  const { alumniDB, setAlumniDB } = useAppModel();

  if (!isLoggedIn) {
    return <LoginScreen onLogin={setIsLoggedIn} />;
  }

  return (
    // Background utama diubah menjadi sedikit hangat (krem muda) agar sinkron dengan tema autumn
    <div className="min-h-screen bg-[#fffcf9] flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* Sidebar Navigasi (Warna diganti menggunakan hex dari CSS Anda) */}
      <nav className="bg-[#7a251e] text-white w-full md:w-64 flex-shrink-0 shadow-lg md:min-h-screen flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wider">Alumni<span className="text-[#fca85d]">Track</span></h1>
        </div>
        <div className="flex flex-row md:flex-col px-4 gap-2 overflow-x-auto flex-1">
          {/* Menu Daftar Pengguna (Excel + Supabase) */}
          <button onClick={() => setActiveTab('daftar_alumni')} className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${activeTab === 'daftar_alumni' ? 'bg-[#8f2c24]' : 'hover:bg-[#8f2c24]/60'}`}>
            <Users size={18}/> Daftar Alumni
          </button>

          <button onClick={() => setActiveTab('pendataan')} className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${activeTab === 'pendataan' ? 'bg-[#8f2c24]' : 'hover:bg-[#8f2c24]/60'}`}><FileText size={18}/> Pendataan</button>
          <button onClick={() => setActiveTab('pencarian')} className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${activeTab === 'pencarian' ? 'bg-[#8f2c24]' : 'hover:bg-[#8f2c24]/60'}`}><Search size={18}/> Lacak Terpadu</button>
          <button onClick={() => setActiveTab('peta')} className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${activeTab === 'peta' ? 'bg-[#8f2c24]' : 'hover:bg-[#8f2c24]/60'}`}><MapPin size={18}/> Peta Sebaran</button>
          <button onClick={() => setActiveTab('admin')} className={`flex items-center gap-3 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${activeTab === 'admin' ? 'bg-[#8f2c24]' : 'hover:bg-[#8f2c24]/60'}`}><ShieldCheck size={18}/> Verifikasi</button>
        </div>
        <div className="p-4 mt-auto">
           <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-950/50 text-[#fca85d] transition-colors"><LogOut size={18}/> Keluar</button>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'daftar_alumni' && <DaftarPenggunaView />}
        {activeTab === 'pencarian' && <PencarianView alumniDB={alumniDB} />}
        {activeTab === 'peta' && <PetaView alumniDB={alumniDB} />}
        {activeTab === 'pendataan' && <PendataanView alumniDB={alumniDB} setAlumniDB={setAlumniDB} />}
        {activeTab === 'admin' && <AdminView alumniDB={alumniDB} setAlumniDB={setAlumniDB} />}
      </main>

    </div>
  );
}
