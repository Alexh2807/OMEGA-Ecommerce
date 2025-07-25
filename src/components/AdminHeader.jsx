import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/45c48586-c5e0-4e65-b93e-6bd153f2a4e5/8ffc7cc18832cf809945967cfd1bf6e6.png" 
                alt="OMEGA Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold omega-blue">OMEGA</span>
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-lg font-semibold text-gray-700">Administration</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{user?.firstName} {user?.lastName}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;