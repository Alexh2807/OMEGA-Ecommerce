import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/use-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté au panier`,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
      className="bg-card rounded-lg border border-border overflow-hidden transition-shadow duration-300"
    >
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </Link>
        {product.originalPrice && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
            PROMO
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-sm text-primary font-medium">{product.category}</span>
        </div>
        
        <h3 className="text-md font-semibold text-foreground mb-2 h-12 line-clamp-2">
          <Link to={`/products/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h3>
        
        <div className="flex items-baseline justify-between mb-4">
          <div className="text-xl font-bold text-foreground">
            {product.price.toFixed(2)} €
          </div>
          {product.originalPrice && (
            <div className="text-sm text-muted-foreground line-through">
              {product.originalPrice.toFixed(2)} €
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 omega-gradient flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Ajouter</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;