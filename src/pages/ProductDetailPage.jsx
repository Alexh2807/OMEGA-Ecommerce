import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/contexts/ProductContext';
import { toast } from '@/components/ui/use-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { getProductById } = useProducts();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchedProduct = getProductById(id);
    if (fetchedProduct) {
        const productData = {
            ...fetchedProduct,
            images: [
              fetchedProduct.image,
              fetchedProduct.image,
              fetchedProduct.image
            ],
            longDescription: fetchedProduct.longDescription || `${fetchedProduct.description}\n\nPlus de détails sur ce produit seront bientôt disponibles.`,
            specifications: fetchedProduct.specifications || {
                'Type': fetchedProduct.category,
                'Disponibilité': fetchedProduct.inStock ? 'En stock' : 'Rupture',
                'SKU': `SKU-${fetchedProduct.id}`
            },
            sku: `SKU-${fetchedProduct.id}`
        };
        setProduct(productData);
    }
  }, [id, getProductById]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Produit ajouté au panier",
        description: `${quantity}x ${product.name} ajouté(s) au panier`,
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product ? `${product.name} - OMEGA Solutions Professionnelles` : 'Chargement du produit...'}</title>
        <meta name="description" content={product ? product.description : 'Détails du produit OMEGA'} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/products"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux produits
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <div className="text-sm text-blue-600 font-medium mb-2">{product.category}</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-gray-600 text-lg">{product.description}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-blue-600">
                  {product.price.toFixed(2)} €
                </div>
                {product.originalPrice && (
                  <div className="text-xl text-gray-500 line-through">
                    {product.originalPrice.toFixed(2)} €
                  </div>
                )}
                {product.originalPrice && (
                  <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {product.inStock ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">En stock ({product.stockQuantity} disponibles)</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 font-medium">Rupture de stock</span>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="font-medium text-gray-700">Quantité :</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 omega-gradient flex items-center justify-center space-x-2"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Ajouter au panier</span>
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Livraison 24h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Garantie 2 ans</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Qualité pro</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Description détaillée</h2>
              <div className="prose prose-blue max-w-none">
                <div className="whitespace-pre-line text-gray-600">
                  {product.longDescription}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Spécifications techniques</h2>
              <div className="space-y-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-blue-900">SKU:</span>
                  <span className="text-blue-700">{product.sku}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;