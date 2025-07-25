import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // Calcul des statistiques depuis localStorage
    const products = JSON.parse(localStorage.getItem('omega_products') || '[]');
    const orders = JSON.parse(localStorage.getItem('omega_orders') || '[]');
    const users = JSON.parse(localStorage.getItem('omega_users') || '[]');

    const revenue = orders.reduce((total, order) => total + order.total, 0);

    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: revenue,
      totalUsers: users.length
    });
  }, []);

  const statCards = [
    {
      title: 'Produits',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Commandes',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Chiffre d\'affaires',
      value: `${stats.totalRevenue.toFixed(2)} €`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Utilisateurs',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-orange-500',
      change: '+5%'
    }
  ];

  const recentOrders = JSON.parse(localStorage.getItem('omega_orders') || '[]')
    .slice(-5)
    .reverse();

  return (
    <>
      <Helmet>
        <title>Tableau de bord - Administration OMEGA</title>
        <meta name="description" content="Tableau de bord administrateur OMEGA - Vue d'overview des ventes et statistiques" />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble de votre activité OMEGA</p>
        </motion.div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Commandes récentes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune commande récente
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-blue-600">{order.total.toFixed(2)} €</p>
                          <p className="text-sm text-gray-600">{order.items.length} article(s)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Graphique des ventes (simulation) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Évolution des ventes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Graphique des ventes</p>
                    <p className="text-sm text-gray-500">Fonctionnalité à venir</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Package className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Ajouter un produit</h3>
                  <p className="text-sm text-gray-600">Créer un nouveau produit</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Eye className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Voir les commandes</h3>
                  <p className="text-sm text-gray-600">Gérer les commandes</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Users className="h-8 w-8 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Gérer les clients</h3>
                  <p className="text-sm text-gray-600">Voir les utilisateurs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default AdminDashboard;