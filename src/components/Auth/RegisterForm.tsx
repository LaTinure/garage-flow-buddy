import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, Camera, Eye, EyeOff } from 'lucide-react';
import { signUpWithEmail } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileService } from '@/integrations/supabase/fileService';
import { supabase } from '@/integrations/supabase/client';

interface RegisterFormProps {
  setTab: (tab: 'login' | 'register') => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ setTab }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    { value: 'mecanicien', label: 'Mécanicien' },
    { value: 'gerant_restaurant', label: 'Gérant Restaurant' },
    { value: 'gerant_boutique', label: 'Gérant Boutique' },
    { value: 'electricien', label: 'Électricien' },
    { value: 'admin', label: 'Admin' },
    { value: 'super_admin', label: 'Super Admin' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Création du compte dans Supabase Auth
      const { user, session, error } = await signUpWithEmail(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName
      });
      if (error) {
        setError(error);
        toast.error(error);
        setIsLoading(false);
        return;
      }

      let avatarUrl: string | undefined = undefined;

      // 2. Upload avatar si fourni
      if (avatarFile) {
        const uploadResult = await FileService.uploadUserAvatar(avatarFile);
        if (uploadResult.success && uploadResult.url) {
          avatarUrl = uploadResult.url;
        } else {
          setError(uploadResult.error || "Erreur lors de l'upload de l'avatar");
          setIsLoading(false);
          return;
        }
      }

      // 3. Insertion dans la table users (public)
      if (user) {
        const { error: userInsertError } = await supabase
          .from('users')
          .insert({
            auth_user_id: user.id,
            full_name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            role: selectedRole, // ou autre valeur par défaut
            avatar_url: avatarUrl
          });

        if (userInsertError) {
          setError(userInsertError.message);
          setIsLoading(false);
          return;
        }
      }

      // 4. (Optionnel) Insertion dans user_organizations si besoin
      // await supabase.from('user_organizations').insert({ ... });

      toast.success('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
      setTab('login');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de l\'inscription';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Ajout gestion avatar
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('L\'image est trop volumineuse (max 2Mo)');
        return;
      }
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        setError('Format d\'image non supporté (PNG, JPG, SVG)');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Champ avatar */}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-24 h-24 mb-2">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Aperçu avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-green-200 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center border-4 border-green-200 shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
          )}
          <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors shadow-lg">
            <Camera className="w-4 h-4 text-white" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
        <span className="text-xs text-muted-foreground">PNG, JPG, SVG. Max 2Mo.</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="pl-10"
              placeholder="Votre prénom"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="pl-10"
              placeholder="Votre nom"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10"
            placeholder="votre.email@example.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rôle *</Label>
        <select
          id="role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Sélectionnez votre rôle</option>
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Mot de passe"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirmer le mot de passe"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Inscription...
          </>
        ) : (
          'S\'inscrire'
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;