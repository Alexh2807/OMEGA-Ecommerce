import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { toast } from '@/components/ui/use-toast';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateStock } = useProducts();

  const loadOrders = useCallback(() => {
    setLoading(true);
    try {
      const savedOrders = JSON.parse(localStorage.getItem('omega_orders') || '[]');
      setOrders(savedOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error("Failed to load orders from localStorage", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    
    const handleStorageChange = (event) => {
      if (event.key === 'omega_orders') {
        loadOrders();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadOrders]);

  const updateLocalStorage = (data) => {
    localStorage.setItem('omega_orders', JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
  };

  const addOrder = useCallback((newOrder) => {
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    updateLocalStorage(updatedOrders);

    // Decrease stock for each item in the order
    newOrder.items.forEach(item => {
      updateStock(item.id, item.quantity);
    });
  }, [orders, updateStock]);

  const updateOrderStatus = useCallback((orderId, newStatus, trackingLink = '') => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;

    const isCancelled = newStatus === 'cancelled' && orderToUpdate.status !== 'cancelled';

    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus, trackingLink: newStatus === 'shipped' ? trackingLink : order.trackingLink } : order
    );
    setOrders(updatedOrders);
    updateLocalStorage(updatedOrders);

    // If order is cancelled, restore stock
    if (isCancelled) {
      orderToUpdate.items.forEach(item => {
        updateStock(item.id, -item.quantity); // Negative quantity to add back
      });
      toast({ title: "Commande annulée", description: "Le stock a été restauré." });
    } else {
      toast({ title: "Statut mis à jour" });
    }
  }, [orders, updateStock]);

  const value = {
    orders,
    loading,
    addOrder,
    updateOrderStatus,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};