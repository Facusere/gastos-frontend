import { Menu, User } from 'lucide-react';
import { useState } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

import { removeToken } from '../utils/auth';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <>
      <header className="w-full h-16 flex items-center justify-between px-4 md:px-8 bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg text-gray-800">GastosApp</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="bg-gray-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition flex items-center gap-1"
          >
            <User size={18} /> Perfil
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white shadow-lg h-full">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}
    </>
  );
}
