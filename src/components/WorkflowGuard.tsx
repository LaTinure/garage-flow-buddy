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
type InitStep = 'super-admin' | 'pricing' | 'create-admin' | 'create-organization' | 'sms-validation' | 'garage-setup';

const WorkflowGuard: React.FC<WorkflowGuardProps> = ({ children }) => {
  const [workflowState, setWorkflowState] = useState<WorkflowState>('loading');
  const [initStep, setInitStep] = useState<InitStep>('super-admin');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkWorkflowState();
  }, []);

  const checkWorkflowState = async () => {
    console.log('[1] 🔍 Début vérification workflow séquentielle stricte');

    try {
      setLoading(true);

      // ÉTAPE 1: Vérification Super Admins (STRICTE)
      console.log('[2] 🛡️ Vérification super_admins...');
      const { count: superAdminCount, error: adminError } = await supabase
        .from('super_admins')
        .select('*', { count: 'exact', head: true })
        .eq('est_actif', true);

      if (adminError) {
        console.error('[ERROR] Erreur super_admins:', adminError);
        throw adminError;
      }

      console.log('[3] 📊 Super admins trouvés:', superAdminCount);

      // Si aucun super admin → STOPPER et demander création
      if (!superAdminCount || superAdminCount === 0) {
        console.log('[4] ❌ Aucun super admin → Arrêt du workflow');
        setWorkflowState('needs-init');
        setInitStep('super-admin');
        setLoading(false);
        return;
      }

      // ÉTAPE 2: Vérification Session Auth (STRICTE)
      console.log('[5] 🔐 Vérification session auth...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('[6] ❌ Pas de session → Redirection auth');
        setWorkflowState('needs-auth');
        setLoading(false);
        return;
      }

      console.log('[7] ✅ Session active pour:', session.user.email);

      // ÉTAPE 3: Vérification Administrateurs Org (STRICTE)
      console.log('[8] 👨‍💼 Vérification administrateurs...');
      const { count: adminCount, error: adminOrgError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .in('role', ['admin', 'proprietaire']);

      if (adminOrgError) {
        console.error('[ERROR] Erreur admin check:', adminOrgError);
        throw adminOrgError;
      }

      console.log('[9] 📊 Administrateurs trouvés:', adminCount);

      // Si aucun admin → STOPPER et demander création
      if (!adminCount || adminCount === 0) {
        console.log('[10] ❌ Aucun administrateur → Workflow création admin');
        setWorkflowState('needs-init');
        setInitStep('pricing'); // Commencer par le pricing
        setLoading(false);
        return;
      }

      // ÉTAPE 4: Vérification Organisations (STRICTE)
      console.log('[11] 🏢 Vérification organisations...');
      const { count: orgCount, error: orgError } = await supabase
        .from('organisations')
        .select('*', { count: 'exact', head: true });

      if (orgError) {
        console.error('[ERROR] Erreur org check:', orgError);
        throw orgError;
      }

      console.log('[12] 📊 Organisations trouvées:', orgCount);

      // Si aucune organisation → STOPPER et demander création
      if (!orgCount || orgCount === 0) {
        console.log('[13] ❌ Aucune organisation → Workflow création org');
        setWorkflowState('needs-init');
        setInitStep('create-organization');
        setLoading(false);
        return;
      }

      // ÉTAPE 5: Vérification du rôle utilisateur actuel
      console.log('[14] 🔍 Vérification rôle utilisateur...');
      const { data: currentUser, error: userError } = await supabase
        .from('users')
        .select('role, organisation_id')
        .eq('id', session.user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('[ERROR] Erreur user check:', userError);
        throw userError;
      }

      if (!currentUser) {
        console.log('[15] ❌ Utilisateur non trouvé dans users → Création nécessaire');
        setWorkflowState('needs-init');
        setInitStep('create-admin');
        setLoading(false);
        return;
      }

      console.log('[16] 👤 Utilisateur trouvé:', {
        role: currentUser.role,
        orgId: currentUser.organisation_id
      });

      // ÉTAPE 6: Validation finale - Utilisateur admin avec organisation
      if (currentUser.role === 'admin' && currentUser.organisation_id) {
        console.log('[17] ✅ Configuration complète → Redirection dashboard');
        setWorkflowState('ready');
        setLoading(false);
        // Redirection explicite vers dashboard après délai
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
        return;
      }

      // Cas par défaut - problème de configuration
      console.log('[18] ⚠️ Configuration incomplète → Réinitialisation');
      console.log('[19] 🔍 Détails utilisateur:', { 
        role: currentUser.role, 
        orgId: currentUser.organisation_id,
        hasRole: !!currentUser.role,
        hasOrg: !!currentUser.organisation_id
      });
      
      // Déterminer l'étape suivante basée sur ce qui manque
      if (!currentUser.role || !['admin', 'proprietaire'].includes(currentUser.role)) {
        setInitStep('create-admin');
      } else if (!currentUser.organisation_id) {
        setInitStep('create-organization');
      } else {
        setInitStep('garage-setup');
      }
      
      setWorkflowState('needs-init');
      setLoading(false);

    } catch (error) {
      console.error('[ERROR CRITIQUE] Workflow guard:', error);
      // En cas d'erreur critique, forcer la réinitialisation complète
      setWorkflowState('needs-init');
      setInitStep('super-admin');
      setLoading(false);
    }
  };

  const handleInitComplete = () => {
    console.log('✅ Initialisation terminée - Vérification finale');
    toast.success('Configuration terminée avec succès !');
    
    // Marquer comme prêt et laisser le guard faire une nouvelle vérification
    setWorkflowState('ready');
    
    // Délai pour permettre au système de traiter les données
    setTimeout(() => {
      checkWorkflowState(); // Re-vérifier l'état après completion
    }, 1000);
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
        startStep={initStep as 'super-admin' | 'pricing' | 'create-admin'}
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