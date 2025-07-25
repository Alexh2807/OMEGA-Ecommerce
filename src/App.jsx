import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { OrderProvider } from '@/contexts/OrderContext';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import SmokeMachinePage from '@/pages/SmokeMachinePage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import OrdersPage from '@/pages/OrdersPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminProducts from '@/pages/AdminProducts';
import AdminOrders from '@/pages/AdminOrders';
import AdminSettings from '@/pages/AdminSettings';
import AdminReports from '@/pages/AdminReports';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/AdminLayout';
import PaymentStatusPage from '@/pages/PaymentStatusPage';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <Router>
              <Helmet>
                <title>OMEGA - Solutions Événementielles</title>
                <meta name="description" content="OMEGA - Votre partenaire pour des événements inoubliables. Vente et location de matériel scénique, effets spéciaux, et plus." />
              </Helmet>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="products/omega-hazer-co2" element={<SmokeMachinePage />} />
                  <Route path="products/:id" element={<ProductDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="payment-status" element={<PaymentStatusPage />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="reports" element={<AdminReports />} />
                </Route>
              </Routes>
              <Toaster />
            </Router>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
