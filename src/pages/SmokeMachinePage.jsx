import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Zap, Thermometer, Gauge, Droplets, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SmokeMachinePage = () => {
    const { getProductById } = useProducts();
    const { addToCart } = useCart();
    
    const product = getProductById('prod_hazer_co2');
    const fluidProduct = getProductById('prod_liquide_hazer');

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
                <p>Produit non trouvé.</p>
            </div>
        );
    }

    const handleAddToCart = (item) => {
        addToCart(item);
        toast({
            title: "Produit ajouté !",
            description: `${item.name} est maintenant dans votre panier.`,
        });
    };

    const features = [
        { icon: Zap, text: "Puissance et efficacité CO² pour un débit élevé." },
        { icon: Thermometer, text: "Temps de chauffe quasi-instantané." },
        { icon: Gauge, text: "Contrôle DMX 512 pour une intégration parfaite." },
        { icon: Droplets, text: "Optimisé pour le liquide OMEGA Pro Hazer." },
    ];

    return (
        <>
            <Helmet>
                <title>{product.name} - OMEGA</title>
                <meta name="description" content={product.description} />
            </Helmet>
            <div className="min-h-screen bg-background text-foreground">
                <div className="container mx-auto px-4 py-12 md:py-20">
                    <div className="grid lg:grid-cols-5 gap-12 items-start">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="lg:col-span-3 bg-card p-4 rounded-lg border border-border"
                        >
                            <img 
                                src={product.image}
                                alt={product.name}
                                className="w-full h-auto rounded-md shadow-2xl shadow-primary/10"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="lg:col-span-2 flex flex-col gap-6"
                        >
                            <div>
                                <span className="text-primary font-semibold">{product.category}</span>
                                <h1 className="text-3xl md:text-5xl font-extrabold my-2 tracking-tighter">{product.name}</h1>
                                <p className="text-muted-foreground text-lg mb-4">{product.description}</p>
                            </div>

                             <Card className="bg-card/50 border-border">
                                <CardHeader>
                                    <CardTitle>Spécifications Clés</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {features.map((feature, index) => {
                                            const Icon = feature.icon;
                                            return (
                                                <li key={index} className="flex items-center">
                                                    <Icon className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                                                    <span className="text-muted-foreground">{feature.text}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </CardContent>
                            </Card>

                            <div className="flex items-center justify-between bg-card rounded-lg p-4">
                                <div>
                                    <span className="text-sm text-muted-foreground line-through">{product.originalPrice.toFixed(2)} €</span>
                                    <p className="text-3xl font-bold text-primary">{product.price.toFixed(2)} €</p>
                                </div>
                                <Button size="lg" className="omega-gradient" onClick={() => handleAddToCart(product)} disabled={!product.inStock}>
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    {product.inStock ? "Ajouter" : "Indisponible"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {fluidProduct && (
                        <motion.div 
                          className="mt-20"
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card className="bg-card border-border overflow-hidden">
                                <div className="grid md:grid-cols-2 items-center">
                                    <div className="p-8 md:p-12">
                                        <h2 className="text-3xl font-bold mb-3">Le Consommable Recommandé</h2>
                                        <h3 className="text-xl font-semibold text-primary mb-4">{fluidProduct.name}</h3>
                                        <p className="text-muted-foreground mb-6">{fluidProduct.description}</p>
                                        <div className="flex items-center gap-6">
                                            <Button size="lg" onClick={() => handleAddToCart(fluidProduct)}>
                                                <ShoppingCart className="mr-2 h-5 w-5" />
                                                Ajouter le liquide ({fluidProduct.price.toFixed(2)}€)
                                            </Button>
                                            <Link to={`/products/${fluidProduct.id}`}>
                                                <Button variant="link">Voir détails <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="h-full w-full">
                                        <img src={fluidProduct.image} alt={fluidProduct.name} className="w-full h-full object-cover min-h-[300px]" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SmokeMachinePage;