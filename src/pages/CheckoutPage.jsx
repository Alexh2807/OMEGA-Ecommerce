import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { CreditCard, Shield, Loader2 } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-status`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('Une erreur inattendue est survenue.');
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{layout: "tabs"}} />
      <Button disabled={isProcessing || !stripe || !elements} id="submit" className="w-full omega-gradient mt-6" size="lg">
        <span id="button-text" className="flex items-center justify-center">
          {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
          {isProcessing ? 'Traitement...' : 'Payer maintenant'}
        </span>
      </Button>
      {message && <div id="payment-message" className="text-red-500 text-sm mt-2">{message}</div>}
       <div className="text-center text-xs text-muted-foreground flex items-center justify-center space-x-2 mt-2">
            <Shield className="h-4 w-4" />
            <span>Paiement sécurisé par Stripe</span>
        </div>
    </form>
  );
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState('');
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    country: user?.country || 'France',
  });

   useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    if (!import.meta.env.VITE_STRIPE_SECRET_KEY || import.meta.env.VITE_STRIPE_SECRET_KEY.includes('VOTRE_CLE')) {
       toast({
        variant: "destructive",
        title: "Configuration Stripe manquante 🔑",
        description: "La clé API secrète Stripe n'est pas configurée.",
      });
      return;
    }
    
    const createPaymentIntent = async () => {
        try {
            const subTotal = getTotalPrice();
            const total = subTotal * 1.20; // Add 20% VAT
            const amount = Math.round(total * 100);
            if (amount <= 0) return;
            
            const response = await fetch('https://api.stripe.com/v1/payment_intents', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    amount: amount,
                    currency: 'eur',
                    'automatic_payment_methods[enabled]': 'true',
                })
            });
            const data = await response.json();
            if (data.error) {
                 toast({
                    variant: "destructive",
                    title: "Erreur de paiement",
                    description: "Votre clé API secrète est probablement incorrecte.",
                });
                return;
            }
            setClientSecret(data.client_secret);
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Erreur réseau",
                description: "Impossible de créer la session de paiement.",
            });
        }
    };

    createPaymentIntent();
  }, [items, getTotalPrice, navigate]);


  const handleInputChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    localStorage.setItem('shipping_address', JSON.stringify(newFormData));
  };
  
  if (items.length === 0) {
    return null;
  }

  const subTotal = getTotalPrice();
  const tax = subTotal * 0.20;
  const total = subTotal + tax;

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#1e293b',
      colorText: '#f8fafc',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '0.5rem',
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <Helmet>
        <title>Commande - OMEGA</title>
        <meta name="description" content="Finaliser votre commande OMEGA" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Finaliser la commande</h1>
            <p className="text-muted-foreground">Complétez vos informations et procédez au paiement</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-card border-border">
                  <CardHeader><CardTitle>Informations de livraison</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label htmlFor="firstName">Prénom</Label><Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required /></div>
                        <div><Label htmlFor="lastName">Nom</Label><Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required /></div>
                      </div>
                      <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required /></div>
                    <div><Label htmlFor="address">Adresse</Label><Input id="address" name="address" value={formData.address} onChange={handleInputChange} required /></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div><Label htmlFor="city">Ville</Label><Input id="city" name="city" value={formData.city} onChange={handleInputChange} required /></div>
                      <div><Label htmlFor="postalCode">Code postal</Label><Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required /></div>
                      <div><Label htmlFor="country">Pays</Label><Input id="country" name="country" value={formData.country} onChange={handleInputChange} required /></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-card border-border">
                    <CardHeader><CardTitle>Informations de paiement</CardTitle></CardHeader>
                    <CardContent>
                       {clientSecret ? (
                        <Elements options={options} stripe={stripePromise}>
                          <CheckoutForm clientSecret={clientSecret} />
                        </Elements>
                      ) : (
                        <div className="flex items-center justify-center h-24">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      )}
                    </CardContent>
                </Card>
              </motion.div>
            </div>
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-6 h-fit">
                <Card className="bg-card border-border">
                  <CardHeader><CardTitle>Résumé de commande</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-muted-foreground">Qté: {item.quantity}</div>
                          </div>
                          <div className="font-medium">{(item.price * item.quantity).toFixed(2)} €</div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex justify-between"><span>Sous-total</span><span>{subTotal.toFixed(2)} €</span></div>
                      <div className="flex justify-between"><span>TVA (20%)</span><span>{tax.toFixed(2)} €</span></div>
                      <div className="flex justify-between"><span>Livraison</span><span className="text-green-400">Gratuite</span></div>
                      <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2"><span>Total</span><span className="text-primary">{total.toFixed(2)} €</span></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;