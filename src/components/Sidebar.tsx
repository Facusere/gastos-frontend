import { Home, BarChart2, PlusCircle, CreditCard } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
  { to: '/report', icon: <BarChart2 size={20} />, label: 'Reportes' },
  { to: '/new-expense', icon: <PlusCircle size={20} />, label: 'Nuevo Gasto' },
  { to: '/subscriptions', icon: <CreditCard size={20} />, label: 'Suscripciones' },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="hidden md:flex flex-col w-56 h-screen bg-white border-r shadow-sm">
      <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
            onClick={onNavigate}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
