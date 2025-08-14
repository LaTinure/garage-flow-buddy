import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
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
  const [initStep, setInitStep] = useState<'super-admin' | 'create-admin' | 'pricing'>('super-admin');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkWorkflowState();
  }, []);

  const checkWorkflowState = async () => {
    console.log('[1] Début vérification workflow');

    try {
      // 1. Vérification initiale - Existe-t-il au moins un super admin ?
      console.log('[2] Vérification super_admins...');
      const { count: superAdminCount, error: adminError } = await supabase
        .from('super_admins')
        .select('*', { count: 'exact', head: true })
        .eq('est_actif', true);

      // Log pour debug
      console.log('[3] Résultat super_admins:', { superAdminCount, adminError });

      // Si pas de super admin, forcer l'initialisation
      if (!superAdminCount || superAdminCount === 0) {
        console.log('[4] Aucun super admin → Initialisation requise');
        setWorkflowState('needs-init');
        setInitStep('super-admin');
        setLoading(false);
        return;
      }

      // 2. Si on a un super admin, vérifier la session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[5] Session:', session ? 'Existe' : 'Absente');

      if (!session) {
        console.log('[6] Pas de session active → Auth nécessaire');
        setWorkflowState('needs-auth');
        setLoading(false);
        return;
      }

      // 3. Vérification des organisations seulement si authentifié
      const { count: orgCount } = await supabase
        .from('organisations')
        .select('*', { count: 'exact', head: true });

      console.log('[7] Nombre d\'organisations:', orgCount);

      if (!orgCount || orgCount === 0) {
        console.log('[8] Aucune organisation → Création admin');
        setWorkflowState('needs-init');
        setInitStep('create-admin');
      } else {
        console.log('[9] Configuration complète → Ready');
        setWorkflowState('ready');
      }

    } catch (error) {
      console.error('[10] Erreur critique:', error);
      // En cas d'erreur, forcer l'initialisation
      setWorkflowState('needs-init');
      setInitStep('super-admin');
    } finally {
      setLoading(false);
    }
  };

  const handleInitComplete = () => {
    console.log('✅ Initialisation terminée');
    toast.success('Configuration terminée ! Vous pouvez maintenant vous connecter.');
    setWorkflowState('ready');
    // Rediriger vers auth pour que l'utilisateur se connecte
    navigate('/auth');
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
  if (loading) {
    return <SplashScreen onComplete={() => setLoading(false)} />;
  }

  // Log pour debug
  console.log('[Render] État actuel:', { workflowState, initStep });

  // Rendu strict basé sur l'état
  if (workflowState === 'needs-init') {
    return (
      <InitializationWizard
        isOpen={true}
        onComplete={handleInitComplete}
        startStep={initStep}
      />
    );
  }

  if (workflowState === 'needs-auth') {
    window.location.href = '/auth'; // Forcer la redirection complète
    return null;
  }

  if (workflowState === 'ready') {
    return <>{children}</>;
  }

  return null;
};

async function checkForExistingAdmins() {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .in('role', ['admin', 'proprietaire']);

    if (error) {
      return { hasAdmins: false, error };
    }

    return { hasAdmins: !!count && count > 0, error: null };
  } catch (error) {
    return { hasAdmins: false, error };
  }
}

export default WorkflowGuard;