import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import AdminProductForm from '@/components/AdminProductForm';
import AdminProductList from '@/components/AdminProductList';
import AdminProductFilters from '@/components/AdminProductFilters';
import { useProducts } from '@/contexts/ProductContext';

const AdminProducts = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    inStock: true,
    stockQuantity: ''
  });

  useEffect(() => {
    if (!loading) {
      setFilteredProducts(products);
    }
  }, [products, loading]);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stockQuantity: parseInt(formData.stockQuantity, 10)
    };

    if (editingProduct) {
      updateProduct({ ...productData, id: editingProduct.id });
      toast({
        title: "Produit modifié",
        description: "Le produit a été mis à jour avec succès",
      });
    } else {
      addProduct(productData);
      toast({
        title: "Produit ajouté",
        description: "Le nouveau produit a été créé avec succès",
      });
    }

    resetForm();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      category: product.category,
      image: product.image,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès",
      });
      
      setProductToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      image: '',
      inStock: true,
      stockQuantity: ''
    });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gestion des Produits - Administration OMEGA</title>
        <meta name="description" content="Gérez les produits de votre catalogue OMEGA" />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Produits</h1>
            <p className="text-gray-600">Gérez votre catalogue de produits</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="omega-gradient" onClick={() => { setEditingProduct(null); resetForm(); setIsDialogOpen(true);}}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
                </DialogTitle>
              </DialogHeader>
              
              <AdminProductForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onCancel={resetForm}
                editingProduct={editingProduct}
              />
            </DialogContent>
          </Dialog>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AdminProductFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AdminProductList
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={setProductToDelete}
          />
        </motion.div>

        <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default AdminProducts;