import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Package, Truck, CheckCircle, Clock, Eye, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';

const OrdersPage = () => {
  const { user } = useAuth();
  const { orders, loading } = useOrders();
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    if (user && !loading) {
      setUserOrders(orders.filter(o => o.userId === user.id));
    }
  }, [user, orders, loading]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'processing': return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'shipped': return <Truck className="h-5 w-5 text-blue-400" />;
      case 'delivered': return <Package className="h-5 w-5 text-teal-400" />;
      case 'cancelled': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      confirmed: 'Confirmée',
      processing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return statusMap[status] || 'En attente';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      confirmed: 'bg-green-900/50 text-green-300',
      processing: 'bg-yellow-900/50 text-yellow-300',
      shipped: 'bg-blue-900/50 text-blue-300',
      delivered: 'bg-teal-900/50 text-teal-300',
      cancelled: 'bg-red-900/50 text-red-300'
    };
    return colorMap[status] || 'bg-gray-700 text-gray-300';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Accès non autorisé</h2>
          <p className="text-muted-foreground">Veuillez vous connecter pour voir vos commandes.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Mes Commandes - OMEGA`}</title>
        <meta name="description" content="Suivez vos commandes OMEGA et consultez l'historique de vos achats" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mes Commandes</h1>
            <p className="text-muted-foreground">Suivez vos commandes et consultez votre historique d'achats</p>
          </motion.div>

          {loading ? <p>Chargement...</p> : userOrders.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <Card className="bg-card border-border p-12 max-w-md mx-auto">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Aucune commande</h2>
                <p className="text-muted-foreground mb-8">Vous n'avez pas encore passé de commande.</p>
                <Button className="omega-gradient">Découvrir nos produits</Button>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {userOrders.map((order, index) => (
                <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <CardTitle className="text-lg text-primary">Commande {order.id}</CardTitle>
                          <p className="text-sm text-muted-foreground">Passée le {new Date(order.date).toLocaleString('fr-FR')}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span>{getStatusText(order.status)}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{order.total.toFixed(2)} €</div>
                            <div className="text-sm text-muted-foreground">{order.items.length} article(s)</div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-3 bg-background rounded-lg">
                              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.category}</p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-sm text-muted-foreground">Qté: {item.quantity}</span>
                                  <span className="text-sm font-medium text-primary">{item.price.toFixed(2)} € / unité</span>
                                </div>
                              </div>
                              <div className="text-right font-medium">{(item.price * item.quantity).toFixed(2)} €</div>
                            </div>
                          ))}
                        </div>
                        {order.trackingLink && (
                          <div className="pt-4 border-t border-border">
                            <a href={order.trackingLink} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" className="w-full">
                                <Truck className="h-4 w-4 mr-2" />
                                Suivre la livraison
                                <ExternalLink className="h-4 w-4 ml-2" />
                              </Button>
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;