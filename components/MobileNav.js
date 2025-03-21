
'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaHome, FaSearch, FaBell, FaUser, FaPlus } from 'react-icons/fa';

export default function MobileNav({ openTweetModal }) {
  const { user } = useAuth();

  return (
    <div className="flex justify-around items-center py-3">
      <Link href="/" className="p-2 text-xl">
        <FaHome />
      </Link>
      
      <Link href="/search" className="p-2 text-xl">
        <FaSearch />
      </Link>
      
      {user && (
        <>
          <button 
            onClick={openTweetModal}
            className="bg-primary text-white rounded-full p-3 -mt-8 shadow-lg"
          >
            <FaPlus />
          </button>
          
          <Link href="/notifications" className="p-2 text-xl">
            <FaBell />
          </Link>
          
          <Link href={`/profile/${user.username}`} className="p-2 text-xl">
            <FaUser />
          </Link>
        </>
      )}
    </div>
  );
}
