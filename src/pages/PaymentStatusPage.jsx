import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStripe, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { toast } from '@/components/ui/use-toast';

const PaymentStatusPage = () => {
  const stripe = useStripe();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const { items: cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder, orders } = useOrders();

  useEffect(() => {
    const clientSecret = searchParams.get('payment_intent_client_secret');
    const paymentIntentId = searchParams.get('payment_intent');

    if (!stripe || !clientSecret) {
      setStatus('error');
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setStatus('success');
          
          const existingOrder = orders.find(o => o.id === paymentIntentId);

          if (!existingOrder && cartItems.length > 0) {
            const subTotal = getTotalPrice();
            const tax = subTotal * 0.20;
            const total = subTotal + tax;

            const newOrder = {
              id: paymentIntentId,
              items: cartItems,
              subTotal: subTotal,
              tax: tax,
              total: total,
              status: 'confirmed',
              date: new Date().toISOString(),
              userId: user?.id,
              shippingAddress: JSON.parse(localStorage.getItem('shipping_address') || '{}'),
              trackingLink: ''
            };
            
            addOrder(newOrder);
            
            toast({
              title: "Paiement réussi !",
              description: `Votre commande ${paymentIntentId} a été confirmée.`,
              className: "bg-green-600 text-white",
            });
            
            clearCart();
            localStorage.removeItem('shipping_address');
          }
          break;
        case 'processing':
          setStatus('processing');
          break;
        default:
          setStatus('error');
          break;
      }
    });
  }, [stripe, searchParams, clearCart, cartItems, getTotalPrice, user, addOrder, orders]);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Paiement réussi !</h2>
            <p className="text-muted-foreground mb-8">
              Merci pour votre commande. Un email de confirmation vous a été envoyé.
            </p>
            <Link to="/orders">
              <Button className="omega-gradient w-full">
                Voir mes commandes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </>
        );
      case 'error':
        return (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Échec du paiement</h2>
            <p className="text-muted-foreground mb-8">
              Une erreur est survenue. Veuillez réessayer ou contacter le support.
            </p>
            <Link to="/checkout">
              <Button variant="outline" className="w-full">
                Réessayer le paiement
              </Button>
            </Link>
          </>
        );
      default:
        return (
          <>
            <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Vérification du paiement...</h2>
            <p className="text-muted-foreground mb-8">
              Veuillez patienter pendant que nous confirmons votre transaction.
            </p>
          </>
        );
    }
  }

  return (
    <>
      <Helmet>
        <title>Statut du Paiement - OMEGA</title>
      </Helmet>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center w-full"
          >
            <div className="bg-card rounded-lg p-8 md:p-12 shadow-lg border border-border max-w-md mx-auto">
              {renderContent()}
            </div>
          </motion.div>
        </div>
    </>
  );
};

const PaymentStatusPageWrapper = () => {
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    return (
        <Elements stripe={stripePromise}>
            <PaymentStatusPage />
        </Elements>
    )
}

export default PaymentStatusPageWrapper;