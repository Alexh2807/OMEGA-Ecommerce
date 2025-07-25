import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight, Zap, Waves, Droplets, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/contexts/ProductContext';
import ProductCard from '@/components/ProductCard';

const HomePage = () => {
  const { products, loading } = useProducts();
  
  const hazerProduct = products.find(p => p.id === 'prod_hazer_co2');
  const otherProducts = products.filter(p => p.id !== 'prod_hazer_co2' && p.id !== 'prod_liquide_hazer').slice(0, 3);
  
  const features = [
    { icon: Zap, title: 'Machines Puissantes', description: 'Des équipements conçus pour une performance et une fiabilité extrêmes.' }, 
    { icon: Waves, title: 'Effets Uniques', description: 'Créez des ambiances inoubliables avec nos solutions d\'effets spéciaux.' }, 
    { icon: Droplets, title: 'Consommables Pro', description: 'Des fluides optimisés pour maximiser les performances de nos machines.' }, 
    { icon: Sparkles, title: 'Prestations sur Mesure', description: 'Notre équipe d\'experts vous accompagne pour réaliser vos projets.' }
  ];

  return <>
      <Helmet>
        <title>OMEGA - Créateur de Matériel Événementiel Professionnel</title>
        <meta name="description" content="OMEGA conçoit et fabrique des solutions événementielles de pointe. Découvrez nos générateurs de fumée et autres équipements professionnels." />
      </Helmet>

      <div className="bg-background text-foreground">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-black/50 to-transparent z-10"></div>
          <motion.div 
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: 'linear', repeat: Infinity, repeatType: 'mirror' }}
          >
            <img-replace src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200" alt="Concert scene" className="object-cover w-full h-full opacity-20" />
          </motion.div>
          
          <div className="container mx-auto px-4 py-32 lg:py-48 relative z-20">
            <div className="max-w-3xl text-center mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
                  L'Ingénierie au Service de
                  <span className="block text-primary">Votre Spectacle</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Nous ne vendons pas seulement du matériel, nous le créons. Découvrez l'excellence et la fiabilité de nos équipements conçus pour les professionnels.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/products/omega-hazer-co2">
                    <Button size="lg" className="omega-gradient font-semibold w-full sm:w-auto">
                      Découvrir le Hazer CO²
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/products">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">Voir le Catalogue</Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {hazerProduct && (
        <section className="bg-black/50 relative py-20 md:py-32 overflow-hidden border-y border-border">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center md:text-left"
                    >
                        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white uppercase">
                            OMEGA Hazer CO²
                        </h2>
                        <p className="text-2xl font-light text-primary mt-2 mb-6">La Nouvelle Référence</p>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
                            Conçu pour les exigences les plus élevées, notre générateur de fumée offre une densité et une dispersion inégalées. Fiabilité, puissance et contrôle précis pour un impact visuel maximal.
                        </p>
                        <Link to="/products/omega-hazer-co2">
                            <Button size="lg" className="omega-gradient">
                                Voir les détails techniques
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <img 
                            src={hazerProduct.image}
                            alt={hazerProduct.name}
                            className="w-full h-auto rounded-lg shadow-2xl shadow-primary/20"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
        )}
        
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Une Solution Complète
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                De la machine au consommable, nous maîtrisons chaque aspect pour une performance optimale.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl grid md:grid-cols-2 items-center overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="p-8 md:p-12"
                >
                    <h3 className="text-3xl font-bold mb-4">Le Fluide Parfait pour une Brume Parfaite</h3>
                    <p className="text-muted-foreground mb-6">
                        Notre liquide exclusif est l'ingrédient secret pour une atmosphère visuelle inégalée. Conçu à partir d'une huile de qualité médicale, il garantit un brouillard stérile, non toxique, et sans aucun résidu.
                    </p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" /><span><strong className="text-foreground">Finesse Inégalée :</strong> Particules de 0,2 microns pour des effets lumineux spectaculaires.</span></li>
                        <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" /><span><strong className="text-foreground">Économie Maximale :</strong> 90% de fluide en moins par rapport aux systèmes classiques pour un effet supérieur.</span></li>
                        <li className="flex items-start"><CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" /><span><strong className="text-foreground">Zéro Résidu :</strong> Préservez vos équipements optiques. Notre formule ne laisse aucune trace.</span></li>
                    </ul>
                    <Link to="/products/prod_liquide_hazer">
                        <Button variant="outline">Commander le liquide <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </Link>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 1.2 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="h-full w-full"
                >
                    <img-replace src="https://storage.googleapis.com/hostinger-horizons-assets-prod/45c48586-c5e0-4e65-b93e-6bd153f2a4e5/f1b0ff3ae2af3bd4988aea49bbe5677e.png" alt="Liquide pour OMEGA Hazer CO²" className="w-full h-full object-cover min-h-[300px]" />
                </motion.div>
            </div>
          </div>
        </section>


        <section className="py-20 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Explorez Notre Catalogue
              </h2>
              <p className="text-lg text-muted-foreground">
                Découvrez le reste de nos équipements professionnels.
              </p>
            </div>

            {loading ? (
              <div className="text-center"><p>Chargement des produits...</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {otherProducts.map((product, index) => <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                    <ProductCard product={product} />
                  </motion.div>)}
              </div>
            )}
            <div className="text-center">
              <Link to="/products">
                <Button size="lg" className="omega-gradient">
                  Voir tous les produits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>;
};
export default HomePage;