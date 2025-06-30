import { Home, BarChart2, List } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: <Home size={20} />, label: 'Inicio' },
  { to: '/expenses', icon: <List size={20} />, label: 'Gastos' },
  { to: '/report', icon: <BarChart2 size={20} />, label: 'Reportes' },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="bg-white text-text shadow-md p-4 h-full rounded-r-2xl w-60 flex flex-col gap-4">
      <div className="px-8 py-8">
        <span className="font-extrabold text-2xl text-blue-700 drop-shadow">
          Gestión Gastos
        </span>
      </div>
      <nav className="flex-1 px-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-colors text-base ${
                isActive
                  ? 'bg-blue-200 text-blue-700 shadow'
                  : 'text-blue-900 hover:bg-blue-100'
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