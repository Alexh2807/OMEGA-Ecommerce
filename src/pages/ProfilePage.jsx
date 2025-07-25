import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    country: user?.country || 'France'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès",
    });
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      postalCode: user?.postalCode || '',
      country: user?.country || 'France'
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h2>
          <p className="text-gray-600">Veuillez vous connecter pour accéder à votre profil.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mon Profil - OMEGA Solutions Professionnelles</title>
        <meta name="description" content="Gérez vos informations personnelles et préférences de compte OMEGA" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
            <p className="text-gray-600">Gérez vos informations personnelles et préférences</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informations principales */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Informations personnelles</CardTitle>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Modifier</span>
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          className="flex items-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Annuler</span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          className="omega-gradient flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>Sauvegarder</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">
                          {user.firstName}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">
                          {user.lastName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md">
                        {user.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md">
                        {user.phone || 'Non renseigné'}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md">
                        {user.address || 'Non renseignée'}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">
                          {user.city || 'Non renseignée'}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal</Label>
                      {isEditing ? (
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">
                          {user.postalCode || 'Non renseigné'}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Pays</Label>
                      {isEditing ? (
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">
                          {user.country || 'France'}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Résumé du compte */}
              <Card>
                <CardHeader>
                  <CardTitle>Résumé du compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-gray-600">
                        {user.role === 'admin' ? 'Administrateur' : 'Client'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.city && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{user.city}, {user.country}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => toast({
                      title: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine demande ! 🚀"
                    })}
                  >
                    Changer le mot de passe
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => toast({
                      title: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine demande ! 🚀"
                    })}
                  >
                    Préférences de notification
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => toast({
                      title: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine demande ! 🚀"
                    })}
                  >
                    Télécharger mes données
                  </Button>
                </CardContent>
              </Card>

              {/* Informations du compte */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations du compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Membre depuis</span>
                    <span>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut</span>
                    <span className="text-green-600 font-medium">Actif</span>
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

export default ProfilePage;