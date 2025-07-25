import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card text-muted-foreground border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="https://i.ibb.co/9vXy2Vf/logo-omega-white.png"
                alt="OMEGA Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-foreground">OMEGA</span>
            </div>
            <p className="text-sm">
              Votre partenaire pour des événements inoubliables.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <span className="text-lg font-semibold text-foreground mb-4 block">Navigation</span>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Produits</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">Mon Compte</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">Mes Commandes</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-lg font-semibold text-foreground mb-4 block">Nos Services</span>
            <ul className="space-y-2">
              <li>Prestations événementielles</li>
              <li>Location de matériel</li>
              <li>Effets spéciaux</li>
              <li>Sonorisation & Éclairage</li>
            </ul>
          </div>

          <div>
            <span className="text-lg font-semibold text-foreground mb-4 block">Contact</span>
            <div className="space-y-3">
              <div className="flex items-center space-x-3"><Phone className="h-4 w-4 text-primary" /><span >+33 1 23 45 67 89</span></div>
              <div className="flex items-center space-x-3"><Mail className="h-4 w-4 text-primary" /><span >contact@omega-events.com</span></div>
              <div className="flex items-center space-x-3"><MapPin className="h-4 w-4 text-primary" /><span >Paris, France</span></div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} OMEGA. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;