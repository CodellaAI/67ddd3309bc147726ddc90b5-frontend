
'use client';
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

export default function UserCard({ user }) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const { user: currentUser } = useAuth();
  
  const isCurrentUser = currentUser && currentUser._id === user._id;

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      toast.info('Please log in to follow users');
      return;
    }
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user._id}/follow`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
    } catch (error) {
      toast.error('Failed to update follow status');
      console.error(error);
    }
  };

  return (
    <Link href={`/profile/${user.username}`} className="block hover:bg-ultraLight transition duration-200">
      <div className="p-4 flex items-center">
        <img 
          src={user.profilePicture || "https://via.placeholder.com/50"} 
          alt={user.name} 
          className="w-12 h-12 rounded-full mr-3"
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold hover:underline">{user.name}</h3>
              <p className="text-dark">@{user.username}</p>
              {user.bio && (
                <p className="mt-1 text-sm line-clamp-2">{user.bio}</p>
              )}
            </div>
            
            {!isCurrentUser && (
              <button
                onClick={handleFollow}
                className={`${
                  isFollowing 
                    ? 'btn-outline text-sm py-1 px-3' 
                    : 'btn-primary text-sm py-1 px-3'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
