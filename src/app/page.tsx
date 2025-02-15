'use client'

import { useState } from 'react';
import Link from 'next/link';
import { FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d1216] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#ebae3a]">
            TASIS Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400
              rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            <FaSignOutAlt className={isLoggingOut ? 'animate-spin' : ''} />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link 
            href="/reportData" 
            className="group p-6 bg-[#1f1c16] rounded-lg border border-[#594925]/20
              hover:border-[#ebae3a]/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <FaClipboardList className="w-8 h-8 text-[#ebae3a]" />
              <h2 className="text-xl font-semibold text-[#ebae3a]">
                Data Pengaduan
              </h2>
            </div>
            <p className="text-gray-300">
              Lihat dan kelola laporan pengaduan dari siswa
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}