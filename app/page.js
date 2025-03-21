
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import Feed from '@/components/Feed';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex-1 border-x border-extraLight">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 border-b border-extraLight">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
        <Feed />
      </div>
    </Layout>
  );
}
