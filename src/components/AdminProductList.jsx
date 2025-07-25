import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminProductList = ({ products, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Produits ({products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun produit trouvé
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                </div>

                <div className="text-right">
                  <div className="font-bold text-blue-600">{product.price.toFixed(2)} €</div>
                  {product.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      {product.originalPrice.toFixed(2)} €
                    </div>
                  )}
                  <div className="text-sm text-gray-600">Stock: {product.stockQuantity}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">
                    {product.inStock ? 'En stock' : 'Rupture'}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminProductList;