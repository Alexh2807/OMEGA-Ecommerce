import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://i.ibb.co/9vXy2Vf/logo-omega-white.png"
              alt="OMEGA Logo" 
              className="h-8 w-auto"
            />
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-foreground">OMEGA</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
              Accueil
            </Link>
            <Link to="/products" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
              Produits
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <User className="h-6 w-6" />
                  <span className="hidden sm:block font-medium">{user.firstName}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-muted-foreground hover:bg-accent">
                    Mon Profil
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-muted-foreground hover:bg-accent">
                    Mes Commandes
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-muted-foreground hover:bg-accent">
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-muted-foreground hover:bg-accent"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="omega-gradient">
                    Inscription
                  </Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-muted-foreground"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border py-4"
          >
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground font-medium">
                Accueil
              </Link>
              <Link to="/products" className="text-muted-foreground hover:text-foreground font-medium">
                Produits
              </Link>
              <hr className="border-border"/>
               {user ? (
                 <>
                  <Link to="/profile" className="text-muted-foreground hover:text-foreground font-medium">Mon Profil</Link>
                  <Link to="/orders" className="text-muted-foreground hover:text-foreground font-medium">Mes Commandes</Link>
                  {user.role === 'admin' && <Link to="/admin" className="text-muted-foreground hover:text-foreground font-medium">Administration</Link>}
                  <Button onClick={handleLogout} variant="ghost">Déconnexion</Button>
                 </>
               ) : (
                 <>
                  <Link to="/login"><Button variant="ghost" className="w-full justify-start">Connexion</Button></Link>
                  <Link to="/register"><Button className="omega-gradient w-full">Inscription</Button></Link>
                 </>
               )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;