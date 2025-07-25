import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Panier - OMEGA Solutions Professionnelles</title>
          <meta name="description" content="Votre panier d'achat OMEGA" />
        </Helmet>

        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-xl p-12 shadow-sm max-w-md mx-auto">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
              <p className="text-gray-600 mb-8">
                Découvrez nos produits et ajoutez-les à votre panier pour commencer vos achats.
              </p>
              <Link to="/products">
                <Button className="omega-gradient">
                  Découvrir nos produits
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Panier (${getTotalItems()}) - OMEGA Solutions Professionnelles`}</title>
        <meta name="description" content="Votre panier d'achat OMEGA" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Panier</h1>
            <p className="text-gray-600">{getTotalItems()} article(s) dans votre panier</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.image}
                      alt={item.name}
                      class="w-20 h-20 object-cover rounded-lg"
                     src="https://images.unsplash.com/photo-1571302171879-0965db383dc4" />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                      <div className="text-lg font-bold text-blue-600">
                        {item.price.toFixed(2)} €
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-gray-600 hover:text-gray-800"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-gray-600 hover:text-gray-800"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-lg font-bold text-gray-900 min-w-[5rem] text-right">
                        {(item.price * item.quantity).toFixed(2)} €
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm h-fit"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé de commande</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{getTotalPrice().toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium text-green-600">Gratuite</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{getTotalPrice().toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/checkout" className="block">
                  <Button className="w-full omega-gradient" size="lg">
                    Procéder au paiement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/products" className="block">
                  <Button variant="outline" className="w-full">
                    Continuer mes achats
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;