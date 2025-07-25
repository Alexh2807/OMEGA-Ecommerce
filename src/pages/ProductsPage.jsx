import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/contexts/ProductContext';

const ProductsPage = () => {
  const { products, categories, loading } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  
  const allCategories = ['all', ...categories];

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Produits - OMEGA</title>
        <meta name="description" content="Découvrez notre gamme complète de produits événementiels." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">
                Notre Catalogue
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Trouvez l'équipement parfait pour votre prochain événement.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-64 space-y-6"
            >
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Recherche
                </h3>
                <Input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Catégories
                </h3>
                <div className="space-y-2">
                  {allCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary/20 text-primary'
                          : 'text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {category === 'all' ? 'Toutes les catégories' : category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Trier par</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 bg-input border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="name">Nom A-Z</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
            </motion.div>

            <div className="flex-1">
              <div className="bg-card rounded-xl p-4 border border-border mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground">
                    {filteredProducts.length} produit(s) trouvé(s)
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="bg-card rounded-xl p-12 border border-border text-center">
                  <div className="text-muted-foreground mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;