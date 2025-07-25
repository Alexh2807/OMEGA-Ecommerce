import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

const defaultProducts = [
  {
    id: 'prod_hazer_co2',
    name: 'OMEGA Hazer CO²',
    description: 'Machine à fumée professionnelle à base de CO² pour des effets de brouillard denses et persistants. Contrôle DMX intégré, fiabilité maximale.',
    price: 1899.99,
    originalPrice: 2199.99,
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/45c48586-c5e0-4e65-b93e-6bd153f2a4e5/645828453a07d9d1f1cfeb6f188a2eb7.png',
    category: 'Machine',
    inStock: true,
    stockQuantity: 25
  },
  {
    id: 'prod_liquide_hazer',
    name: 'Liquide Exclusif OMEGA Pro Hazer CO²',
    description: 'Formulation haut de gamme pour une qualité de brouillard exceptionnelle, une persistance remarquable et zéro résidu.',
    price: 89.90,
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/45c48586-c5e0-4e65-b93e-6bd153f2a4e5/f1b0ff3ae2af3bd4988aea49bbe5677e.png',
    category: 'Consommable',
    inStock: true,
    stockQuantity: 150
  },
  {
    id: 'prod_mousse_canon',
    name: 'Canon à Mousse PartyFoam 2000',
    description: 'Projetez des tonnes de mousse pour des soirées inoubliables. Couverture large et débit élevé.',
    price: 799.00,
    image: 'https://images.unsplash.com/photo-1561432399-e4a3a4aa32de?w=500',
    category: 'Effets Spéciaux',
    inStock: true,
    stockQuantity: 15
  },
  {
    id: 'prod_cable_dmx',
    name: 'Câble DMX Pro 10m',
    description: 'Câble de signal DMX 3 broches de qualité professionnelle pour un contrôle fiable de vos éclairages.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1614300746949-043ac83823e4?w=500',
    category: 'Câblage',
    inStock: true,
    stockQuantity: 200
  },
  {
    id: 'prod_presta_light',
    name: 'Prestation Éclairage Scénique',
    description: 'Service complet de conception et d\'installation d\'éclairage pour votre événement. Sur devis.',
    price: 1500.00,
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=500',
    category: 'Prestation',
    inStock: true,
    stockQuantity: 10
  }
];

const defaultCategories = ['Effets Spéciaux', 'Câblage', 'Machine', 'Prestation', 'Consommable'];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    try {
      const isInitialized = localStorage.getItem('omega_data_initialized_v3');
      if (!isInitialized) {
        localStorage.setItem('omega_products', JSON.stringify(defaultProducts));
        localStorage.setItem('omega_categories', JSON.stringify(defaultCategories));
        localStorage.setItem('omega_data_initialized_v3', 'true');
        setProducts(defaultProducts);
        setCategories(defaultCategories);
      } else {
        const savedProducts = JSON.parse(localStorage.getItem('omega_products') || '[]');
        const savedCategories = JSON.parse(localStorage.getItem('omega_categories') || '[]');
        setProducts(savedProducts);
        setCategories(savedCategories);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setProducts(defaultProducts);
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    
    const handleStorageChange = (event) => {
      if (event.key === 'omega_products' || event.key === 'omega_categories') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadData]);

  const updateLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
  };

  const addProduct = useCallback((product) => {
    const newProducts = [...products, { ...product, id: `prod_${Date.now()}` }];
    setProducts(newProducts);
    updateLocalStorage('omega_products', newProducts);
  }, [products]);

  const updateProduct = useCallback((updatedProduct) => {
    const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(newProducts);
    updateLocalStorage('omega_products', newProducts);
  }, [products]);

  const deleteProduct = useCallback((productId) => {
    const newProducts = products.filter(p => p.id !== productId);
    setProducts(newProducts);
    updateLocalStorage('omega_products', newProducts);
  }, [products]);

  const updateStock = useCallback((productId, quantityChange) => {
    const newProducts = products.map(p => 
      p.id === productId 
        ? { ...p, stockQuantity: p.stockQuantity - quantityChange } 
        : p
    );
    setProducts(newProducts);
    updateLocalStorage('omega_products', newProducts);
  }, [products]);

  const getProductById = useCallback((id) => {
    return products.find(p => p.id === id);
  }, [products]);

  const updateCategories = useCallback((newCategories) => {
    setCategories(newCategories);
    updateLocalStorage('omega_categories', newCategories);
  }, []);

  const value = {
    products,
    categories,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    setCategories: updateCategories,
    updateStock,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
