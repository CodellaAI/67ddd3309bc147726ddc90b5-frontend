
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
import { format } from 'date-fns';

export default function ProfileHeader({ profile, isCurrentUser, onFollow }) {
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 flex items-center">
        <button 
          onClick={handleBackClick} 
          className="mr-6 p-2 rounded-full hover:bg-ultraLight"
        >
          <FaArrowLeft className="text-dark" />
        </button>
        <div>
          <h1 className="text-xl font-bold">{profile.name}</h1>
          <p className="text-dark text-sm">{profile.tweets?.length || 0} Tweets</p>
        </div>
      </div>
      
      <div className="h-48 bg-primary"></div>
      
      <div className="p-4 relative">
        <img 
          src={profile.profilePicture || "https://via.placeholder.com/150"} 
          alt={profile.name} 
          className="absolute -top-16 left-4 w-32 h-32 rounded-full border-4 border-white"
        />
        
        <div className="flex justify-end mb-16">
          {isCurrentUser ? (
            <button 
              onClick={() => setEditing(true)}
              className="btn-outline"
            >
              Edit profile
            </button>
          ) : (
            <button 
              onClick={onFollow}
              className={profile.isFollowing ? "btn-outline" : "btn-primary"}
            >
              {profile.isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
        
        <div className="mb-4">
          <h1 className="text-xl font-bold">{profile.name}</h1>
          <p className="text-dark">@{profile.username}</p>
        </div>
        
        {profile.bio && (
          <p className="mb-3">{profile.bio}</p>
        )}
        
        <div className="flex flex-wrap text-dark mb-3 space-x-4">
          {profile.location && (
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-1" />
              <span>{profile.location}</span>
            </div>
          )}
          
          {profile.website && (
            <div className="flex items-center">
              <FaLink className="mr-1" />
              <a 
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          
          <div className="flex items-center">
            <FaCalendarAlt className="mr-1" />
            <span>Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}</span>
          </div>
        </div>
        
        <div className="flex space-x-5 text-dark">
          <Link href={`/profile/${profile.username}/following`} className="hover:underline">
            <span className="font-bold text-black">{profile.following?.length || 0}</span> Following
          </Link>
          <Link href={`/profile/${profile.username}/followers`} className="hover:underline">
            <span className="font-bold text-black">{profile.followers?.length || 0}</span> Followers
          </Link>
        </div>
      </div>
    </div>
  );
}
