'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function useUserPlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState('free');
  const [loading, setLoading] = useState(true);

  const fetchUserPlan = useCallback(async () => {
    if (!user) {
      setPlan('free');
      setLoading(false);
      return;
    }

    try {
      // Usar una función SQL para obtener el plan del usuario
      const { data, error } = await supabase.rpc('get_user_plan', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error fetching user plan:', error);
        setPlan('free');
      } else {
        setPlan(data || 'free');
      }
    } catch (error) {
      console.error('Error fetching user plan:', error);
      setPlan('free');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserPlan();
  }, [fetchUserPlan]);

  const isPro = plan === 'pro';
  const isFree = plan === 'free';

  return { 
    plan, 
    isPro, 
    isFree, 
    loading,
    // Función para refrescar el plan
    refreshPlan: fetchUserPlan
  };
}