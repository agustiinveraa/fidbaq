'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useUserPlan } from '@/hooks/useUserPlan';
import { CheckCircle } from 'lucide-react';

export default function UpgradeButton({ className, children, disabled = false }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { plan, isPro, loading: planLoading } = useUserPlan();
  const router = useRouter();

  const handleUpgrade = async () => {
    if (disabled || isPro) return;
    
    // Si no está autenticado, redirigir al login
    if (!user) {
      router.push('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId, url } = await response.json();
      
      // Redirigir a Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Si está cargando el plan, mostrar loading
  if (planLoading) {
    return (
      <button 
        disabled
        className={`${className} opacity-50 cursor-not-allowed`}
      >
        Loading...
      </button>
    );
  }

  // Si ya es Pro, mostrar estado completado
  if (isPro) {
    return (
      <button 
        disabled
        className={`${className} bg-green-100 text-green-700 border border-green-200 cursor-not-allowed opacity-75`}
      >
        <CheckCircle className="w-5 h-5 mr-2 inline" />
        Pro Plan Active
      </button>
    );
  }

  return (
    <button 
      onClick={handleUpgrade}
      disabled={loading || disabled}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Procesando...' : user ? children : 'Login to Upgrade'}
    </button>
  );
}