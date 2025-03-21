
'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';
import TweetModal from './TweetModal';
import Widgets from './Widgets';
import MobileNav from './MobileNav';
import { useAuth } from '@/context/AuthContext';

export default function Layout({ children }) {
  const [showTweetModal, setShowTweetModal] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto flex">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:block w-64 lg:w-72 fixed h-screen">
          <Sidebar openTweetModal={() => setShowTweetModal(true)} />
        </div>
        
        {/* Main content */}
        <main className="flex-1 md:ml-64 lg:ml-72 md:mr-80 min-h-screen">
          {children}
        </main>
        
        {/* Right sidebar - hidden on mobile */}
        <div className="hidden lg:block w-80 fixed right-0 h-screen border-l border-extraLight">
          <Widgets />
        </div>
        
        {/* Mobile bottom navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-extraLight z-10">
          <MobileNav openTweetModal={() => setShowTweetModal(true)} />
        </div>
      </div>
      
      {/* Tweet modal */}
      {user && showTweetModal && (
        <TweetModal onClose={() => setShowTweetModal(false)} />
      )}
    </div>
  );
}
