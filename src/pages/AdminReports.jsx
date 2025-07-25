import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Download, Calendar, DollarSign, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminReports = () => {
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [reportStats, setReportStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProductsSold: 0,
  });

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('omega_orders') || '[]');
    setOrders(savedOrders);
    setFilteredOrders(savedOrders);
  }, []);

  useEffect(() => {
    let tempOrders = orders;
    if (startDate) {
      tempOrders = tempOrders.filter(o => new Date(o.date) >= new Date(startDate));
    }
    if (endDate) {
      tempOrders = tempOrders.filter(o => new Date(o.date) <= new Date(endDate));
    }
    setFilteredOrders(tempOrders);
  }, [startDate, endDate, orders]);

  useEffect(() => {
    const revenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const productsSold = filteredOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    
    setReportStats({
      totalRevenue: revenue,
      totalOrders: filteredOrders.length,
      totalProductsSold: productsSold,
    });
  }, [filteredOrders]);

  const downloadCSV = () => {
    const headers = ['ID Commande', 'Date', 'Total (€)', 'Statut', 'Client', 'Adresse', 'Ville', 'Code Postal', 'Produits'];
    const rows = filteredOrders.map(order => {
      const clientName = `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`;
      const address = `${order.shippingAddress.address}`;
      const city = `${order.shippingAddress.city}`;
      const postal = `${order.shippingAddress.postalCode}`;
      const products = order.items.map(item => `${item.name} (x${item.quantity})`).join('; ');

      return [order.id, new Date(order.date).toLocaleDateString('fr-FR'), order.total.toFixed(2), order.status, clientName, address, city, postal, products].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rapport_ventes_omega_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Helmet>
        <title>Rapports - Administration OMEGA</title>
        <meta name="description" content="Générez des rapports de ventes et comptables pour OMEGA" />
      </Helmet>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rapports et Comptabilité</h1>
          <p className="text-gray-600">Analysez vos performances et exportez vos données</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Filtrer par date</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="start-date">Date de début</Label>
                <Input id="start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="end-date">Date de fin</Label>
                <Input id="end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
              <div className="self-end">
                <Button onClick={downloadCSV} className="w-full omega-gradient">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter en CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{reportStats.totalRevenue.toFixed(2)} €</div></CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{reportStats.totalOrders}</div></CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produits vendus</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{reportStats.totalProductsSold}</div></CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Aperçu des commandes filtrées</CardTitle>
              <CardDescription>{filteredOrders.length} commande(s) dans la période sélectionnée.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Total</th>
                      <th className="px-4 py-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.slice(0, 10).map(order => (
                      <tr key={order.id} className="border-b">
                        <td className="px-4 py-2 font-medium">{order.id}</td>
                        <td className="px-4 py-2">{new Date(order.date).toLocaleDateString('fr-FR')}</td>
                        <td className="px-4 py-2">{order.total.toFixed(2)} €</td>
                        <td className="px-4 py-2">{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredOrders.length > 10 && <p className="text-center text-sm text-gray-500 mt-4">...et {filteredOrders.length - 10} autre(s).</p>}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default AdminReports;