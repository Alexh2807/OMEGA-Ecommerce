import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Tableau de bord',
      href: '/admin',
      icon: LayoutDashboard
    },
    {
      title: 'Produits',
      href: '/admin/products',
      icon: Package
    },
    {
      title: 'Commandes',
      href: '/admin/orders',
      icon: ShoppingCart
    },
    {
      title: 'Rapports',
      href: '/admin/reports',
      icon: FileText
    },
    {
      title: 'Paramètres',
      href: '/admin/settings',
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href) && (item.href !== '/admin' || location.pathname === '/admin');
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;