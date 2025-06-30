import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="w-full h-14 flex items-center justify-between px-6 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 shadow-lg sticky top-0 z-30 border-b border-blue-200">
        {/* Botón para abrir sidebar en móvil */}
        <button
          className="md:hidden text-white"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>

        {/* Título */}
        <span className="font-extrabold text-xl text-white tracking-tight drop-shadow">
          GastosApp
        </span>

        {/* Espacio para alinear con el ícono en la izquierda */}
        <div className="w-6 md:hidden" />
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
