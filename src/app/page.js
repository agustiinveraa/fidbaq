'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Bricolage_Grotesque } from 'next/font/google';
import LoadingSpinner from '@/components/LoadingSpinner';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
});

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner message="Redirigiendo..." />;
  }

  return null;
}
