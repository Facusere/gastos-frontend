import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#f8fafc] via-[#eaf1ff] to-[#f0f4ff]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
