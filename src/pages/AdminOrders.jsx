import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Package, Truck, CheckCircle, Clock, Eye, Filter, Ban, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrders } from '@/contexts/OrderContext';
import { toast } from '@/components/ui/use-toast';

const AdminOrders = () => {
  const { orders, loading, updateOrderStatus } = useOrders();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [orderToShip, setOrderToShip] = useState(null);
  const [trackingLink, setTrackingLink] = useState('');

  useEffect(() => {
    if (!loading) {
      let tempOrders = orders;
      if (statusFilter !== 'all') {
        tempOrders = orders.filter(order => order.status === statusFilter);
      }
      setFilteredOrders(tempOrders);
    }
  }, [orders, statusFilter, loading]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'processing': return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'shipped': return <Truck className="h-5 w-5 text-blue-400" />;
      case 'delivered': return <Package className="h-5 w-5 text-teal-400" />;
      case 'cancelled': return <Ban className="h-5 w-5 text-red-400" />;
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
  
  const handleCancelConfirm = () => {
    if (orderToCancel) {
      updateOrderStatus(orderToCancel.id, 'cancelled');
      setOrderToCancel(null);
    }
  };

  const handleShipConfirm = () => {
    if (orderToShip) {
      updateOrderStatus(orderToShip.id, 'shipped', trackingLink);
      setOrderToShip(null);
      setTrackingLink('');
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Toutes' },
    { value: 'confirmed', label: 'Confirmées' },
    { value: 'processing', label: 'En préparation' },
    { value: 'shipped', label: 'Expédiées' },
    { value: 'delivered', label: 'Livrées' },
    { value: 'cancelled', label: 'Annulées' }
  ];

  return (
    <>
      <Helmet>
        <title>Gestion des Commandes - Administration OMEGA</title>
        <meta name="description" content="Gérez les commandes de votre boutique OMEGA" />
      </Helmet>

      <div className="space-y-6 text-foreground">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion des Commandes</h1>
            <p className="text-muted-foreground">Suivez et gérez toutes les commandes</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 bg-input border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  {statusOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <span className="text-sm text-muted-foreground">{filteredOrders.length} commande(s) trouvée(s)</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="space-y-4">
            {loading ? <p>Chargement...</p> : filteredOrders.length === 0 ? (
              <Card className="bg-card border-border"><CardContent className="p-6 text-center text-muted-foreground">Aucune commande trouvée</CardContent></Card>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                      <div>
                        <h3 className="font-semibold text-primary">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleString('fr-FR')}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}<span>{getStatusText(order.status)}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-foreground">{order.total.toFixed(2)} €</div>
                          <div className="text-sm text-muted-foreground">{order.items.length} article(s)</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}><Eye className="h-4 w-4 mr-2" />Détails</Button>
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <div className="flex space-x-2 flex-wrap gap-2">
                          {order.status === 'confirmed' && <Button size="sm" onClick={() => updateOrderStatus(order.id, 'processing')}><RefreshCw className="h-4 w-4 mr-2" />Traiter</Button>}
                          {order.status === 'processing' && <Button size="sm" onClick={() => setOrderToShip(order)}><Truck className="h-4 w-4 mr-2" />Expédier</Button>}
                          <Button size="sm" variant="destructive" onClick={() => setOrderToCancel(order)}><Ban className="h-4 w-4 mr-2" />Annuler</Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-card border-border text-foreground max-w-2xl">
          <DialogHeader><DialogTitle>Détails de la commande {selectedOrder?.id}</DialogTitle></DialogHeader>
          {selectedOrder && <div className="space-y-4"> ... </div>}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!orderToCancel} onOpenChange={() => setOrderToCancel(null)}>
        <AlertDialogContent className="bg-card border-border text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la commande ?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">Cette action est irréversible et remettra les produits en stock.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Non, conserver</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm} className="bg-red-600 hover:bg-red-700">Oui, annuler</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!orderToShip} onOpenChange={() => setOrderToShip(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Expédier la commande</DialogTitle>
            <DialogDescription>Entrez le lien de suivi pour la commande {orderToShip?.id}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label htmlFor="trackingLink">Lien de suivi</Label>
            <Input id="trackingLink" value={trackingLink} onChange={(e) => setTrackingLink(e.target.value)} placeholder="https://suivi.colis/..." />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setOrderToShip(null)}>Annuler</Button>
            <Button onClick={handleShipConfirm} className="omega-gradient">Confirmer l'expédition</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminOrders;