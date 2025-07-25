import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProducts } from '@/contexts/ProductContext';

const AdminProductForm = ({ formData, onInputChange, onSubmit, onCancel, editingProduct }) => {
  const { categories } = useProducts();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nom du produit</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Catégorie</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Prix (€)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={onInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="originalPrice">Prix original (€)</Label>
          <Input
            id="originalPrice"
            name="originalPrice"
            type="number"
            step="0.01"
            value={formData.originalPrice}
            onChange={onInputChange}
          />
        </div>
        <div>
          <Label htmlFor="stockQuantity">Stock</Label>
          <Input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={onInputChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">URL de l'image</Label>
        <Input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={onInputChange}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          id="inStock"
          name="inStock"
          type="checkbox"
          checked={formData.inStock}
          onChange={onInputChange}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <Label htmlFor="inStock" className="ml-2">Produit en stock</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="omega-gradient">
          {editingProduct ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default AdminProductForm;