import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SplashScreen from './SplashScreen';
import InitializationWizard from './InitializationWizard';

interface WorkflowGuardProps {
  children: React.ReactNode;
}

type WorkflowState = 'loading' | 'needs-init' | 'needs-auth' | 'ready';

const WorkflowGuard: React.FC<WorkflowGuardProps> = ({ children }) => {
  const [workflowState, setWorkflowState] = useState<WorkflowState>('loading');
  const [initStep, setInitStep] = useState<'super-admin' | 'pricing' | 'create-admin'>('super-admin');
  const navigate = useNavigate();

  useEffect(() => {
    checkWorkflowState();
  }, []);

  const checkWorkflowState = async () => {
    try {
      console.log('🔍 Vérification de l\'état du workflow...');

      // 1. Vérifier si un super admin existe (PRIORITÉ ABSOLUE)
      const { count: superAdminCount, error: superAdminError } = await supabase
        .from('super_admins')
        .select('*', { count: 'exact', head: true });

      if (superAdminError) {
        console.error('❌ Erreur vérification super admin:', superAdminError);
        // If table doesn't exist, start with super admin creation
        setWorkflowState('needs-init');
        setInitStep('super-admin');
        return;
      }

      if (!superAdminCount || superAdminCount === 0) {
        console.log('⚠️ Aucun super admin trouvé - PREMIER LANCEMENT');
        setWorkflowState('needs-init');
        setInitStep('super-admin');
        return;
      }

      console.log('✅ Super admin trouvé');

      // 2. Vérifier si une organisation existe
      const { count: orgCount, error: orgError } = await supabase
        .from('organisations')
        .select('*', { count: 'exact', head: true });

      if (orgError) {
        console.error('❌ Erreur vérification organisations:', orgError);
        // If table doesn't exist or has issues, start with pricing
        setWorkflowState('needs-init');
        setInitStep('pricing');
        return;
      }

      if (!orgCount || orgCount === 0) {
        console.log('⚠️ Aucune organisation trouvée - AFFICHER PRICING');
        setWorkflowState('needs-init');
        setInitStep('pricing');
        return;
      }

      console.log('✅ Organisation trouvée');

      // 3. Vérifier la session utilisateur (seulement si tout le reste est OK)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('❌ Erreur session:', sessionError);
        setWorkflowState('needs-auth');
        return;
      }

      if (!session) {
        console.log('⚠️ Aucune session, redirection vers auth');
        setWorkflowState('needs-auth');
        return;
      }

      console.log('✅ Session utilisateur valide');

      // 4. Vérifier si l'utilisateur a une organisation sélectionnée
      const storedOrg = localStorage.getItem('current_org');
      const storedOrgCode = localStorage.getItem('org_code');

      if (!storedOrg || !storedOrgCode) {
        console.log('⚠️ Aucune organisation sélectionnée, affichage sélection');
        // Ne pas rediriger vers auth mais afficher la sélection d'organisation
        setWorkflowState('ready'); // Permettre l'accès à OrganizationSelect
        return;
      }

      // Vérifier la validité de l'organisation
      try {
        const { data: org, error: orgError } = await supabase
          .from('organisations')
          .select('id, code')
          .eq('id', storedOrg)
          .eq('code', storedOrgCode)
          .single();

        if (orgError || !org) {
          console.log('⚠️ Organisation invalide, nettoyage et affichage sélection');
          localStorage.removeItem('current_org');
          localStorage.removeItem('org_code');
          setWorkflowState('ready'); // Permettre l'accès à OrganizationSelect
          return;
        }

        console.log('✅ Organisation valide sélectionnée');
      } catch (error) {
        console.error('❌ Erreur validation organisation:', error);
        localStorage.removeItem('current_org');
        localStorage.removeItem('org_code');
        setWorkflowState('ready'); // Permettre l'accès à OrganizationSelect
        return;
      }

      // Tout est prêt
      console.log('🎉 Workflow complet, application prête');
      setWorkflowState('ready');

    } catch (error) {
      console.error('❌ Erreur lors de la vérification du workflow:', error);
      // En cas d'erreur, forcer l'initialisation
      setWorkflowState('needs-init');
      setInitStep('super-admin');
    }
  };

  const handleInitComplete = () => {
    console.log('✅ Initialisation terminée');
    toast.success('Configuration terminée ! Redirection vers le tableau de bord.');
    setWorkflowState('ready');
    // Rediriger vers le tableau de bord après initialisation
    navigate('/dashboard');
  };

  const checkAdminStatus = async () => {
    try {
      const { hasAdmins, error } = await checkForExistingAdmins();

      if (error) {
        console.warn('⚠️ Erreur vérification admins:', error);
        // Continuer avec hasAdmins = false en cas d'erreur
        return false;
      }

      return hasAdmins;
    } catch (error) {
      console.error('❌ Exception vérification admins:', error);
      return false;
    }
  };

  // État de chargement
  if (workflowState === 'loading') {
    return <SplashScreen onComplete={() => { }} />;
  }

  // Besoin d'initialisation (PRIORITÉ ABSOLUE)
  if (workflowState === 'needs-init') {
    console.log('🚀 Lancement du workflow d\'initialisation - Étape:', initStep);
    return (
      <InitializationWizard
        isOpen={true}
        onComplete={handleInitComplete}
        startStep={initStep}
      />
    );
  }

  // Besoin d'authentification (seulement après initialisation complète)
  if (workflowState === 'needs-auth') {
    console.log('🔐 Redirection vers l\'authentification');
    navigate('/auth');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  // Prêt - afficher le contenu
  if (workflowState === 'ready') {
    return <>{children}</>;
  }

  // Fallback - forcer l'initialisation
  console.log('⚠️ État inconnu, forcer l\'initialisation');
  setWorkflowState('needs-init');
  setInitStep('super-admin');
  return (
    <InitializationWizard
      isOpen={true}
      onComplete={handleInitComplete}
      startStep="super-admin"
    />
  );
};

async function checkForExistingAdmins() {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return { hasAdmins: false, error };
    }

    return { hasAdmins: !!count && count > 0, error: null };
  } catch (error) {
    return { hasAdmins: false, error };
  }
}

export default WorkflowGuard;

