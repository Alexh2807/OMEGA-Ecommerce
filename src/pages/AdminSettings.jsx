
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Image, Tag, Save, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useProducts } from '@/contexts/ProductContext';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    logoUrl: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/45c48586-c5e0-4e65-b93e-6bd153f2a4e5/8ffc7cc18832cf809945967cfd1bf6e6.png',
    heroImageUrl: 'https://images.unsplash.com/photo-1470683924855-f35e93ae80b8'
  });
  const { categories, setCategories } = useProducts();
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('omega_settings'));
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleSettingsChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = () => {
    localStorage.setItem('omega_settings', JSON.stringify(settings));
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres du site ont été mis à jour.",
    });
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      localStorage.setItem('omega_categories', JSON.stringify(updatedCategories));
      setNewCategory('');
      toast({ title: "Catégorie ajoutée" });
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
    setCategories(updatedCategories);
    localStorage.setItem('omega_categories', JSON.stringify(updatedCategories));
    toast({ title: "Catégorie supprimée", variant: "destructive" });
  };

  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.newName && !categories.includes(editingCategory.newName)) {
      const updatedCategories = categories.map(cat =>
        cat === editingCategory.oldName ? editingCategory.newName : cat
      );
      setCategories(updatedCategories);
      localStorage.setItem('omega_categories', JSON.stringify(updatedCategories));
      setEditingCategory(null);
      toast({ title: "Catégorie modifiée" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Paramètres - Administration OMEGA</title>
        <meta name="description" content="Gérez les paramètres de votre site OMEGA" />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres du Site</h1>
          <p className="text-gray-600">Gérez la configuration globale de votre boutique</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Image className="h-5 w-5" />
                  <span>Images du site</span>
                </CardTitle>
                <CardDescription>
                  Modifiez les images principales de votre site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logoUrl">URL du Logo</Label>
                  <Input
                    id="logoUrl"
                    name="logoUrl"
                    value={settings.logoUrl}
                    onChange={handleSettingsChange}
                  />
                </div>
                <div>
                  <Label htmlFor="heroImageUrl">URL de l'image d'accueil</Label>
                  <Input
                    id="heroImageUrl"
                    name="heroImageUrl"
                    value={settings.heroImageUrl}
                    onChange={handleSettingsChange}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings} className="omega-gradient">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder les images
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Catégories de produits</span>
                </CardTitle>
                <CardDescription>
                  Ajoutez, modifiez ou supprimez des catégories.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Nouvelle catégorie"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button onClick={handleAddCategory}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      {editingCategory?.oldName === cat ? (
                        <Input
                          value={editingCategory.newName}
                          onChange={(e) => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        <span>{cat}</span>
                      )}
                      <div className="flex space-x-2">
                        {editingCategory?.oldName === cat ? (
                          <Button size="sm" onClick={handleUpdateCategory}>
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => setEditingCategory({ oldName: cat, newName: cat })}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteCategory(cat)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
