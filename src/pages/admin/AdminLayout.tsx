import { NavLink, Outlet } from 'react-router-dom';
import { Users, ScrollText } from 'lucide-react';

const tabs = [
  { to: '/admin/usuarios', label: 'Usuários', icon: Users },
  { to: '/admin/logs', label: 'Logs de auditoria', icon: ScrollText },
];

export default function AdminLayout() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#141414]">Administração</h1>
        <p className="text-[#141414]/60 text-sm mt-1">
          Gestão de usuários e log de auditoria do sistema.
        </p>
      </div>

      <div className="flex gap-2 border-b border-[#141414]/10 pb-2">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#5A5A40] text-white shadow-md'
                  : 'bg-white text-[#141414]/60 border border-[#141414]/10 hover:text-[#141414]'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
