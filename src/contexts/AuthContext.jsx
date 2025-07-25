import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const savedUser = localStorage.getItem('omega_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, role, created_at')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }

      setUser(data);
      localStorage.setItem('omega_user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const register = async (userData) => {
    try {
      // Vérifier si l'email existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        return { success: false, error: 'Cet email est déjà utilisé' };
      }

      // Créer le nouvel utilisateur
      const newUser = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.email === 'admin@omega.com' ? 'admin' : 'user'
      };

      const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select('id, first_name, last_name, email, role, created_at')
        .single();

      if (error) {
        return { success: false, error: 'Erreur lors de la création du compte' };
      }

      setUser(data);
      localStorage.setItem('omega_user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return { success: false, error: 'Erreur d\'inscription' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('omega_user');
  };

  const updateProfile = async (updatedData) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: updatedData.firstName || user.first_name,
          last_name: updatedData.lastName || user.last_name,
          email: updatedData.email || user.email
        })
        .eq('id', user.id)
        .select('id, first_name, last_name, email, role, created_at')
        .single();

      if (error) {
        console.error('Erreur de mise à jour:', error);
        return;
      }

      setUser(data);
      localStorage.setItem('omega_user', JSON.stringify(data));
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
