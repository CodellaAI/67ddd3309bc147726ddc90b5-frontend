
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import Tweet from '@/components/Tweet';
import ProfileHeader from '@/components/ProfileHeader';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`);
        setProfile(profileRes.data);
        
        const tweetsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tweets/user/${profileRes.data._id}`);
        setTweets(tweetsRes.data);
      } catch (error) {
        toast.error('Failed to load profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const handleFollow = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${profile._id}/follow`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update profile data
      setProfile(prev => ({
        ...prev,
        followers: prev.isFollowing 
          ? prev.followers.filter(id => id !== user._id) 
          : [...prev.followers, user._id],
        isFollowing: !prev.isFollowing
      }));
      
      toast.success(profile.isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
    } catch (error) {
      toast.error('Failed to update follow status');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl text-dark">User not found</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 border-x border-extraLight">
        <ProfileHeader 
          profile={profile} 
          isCurrentUser={user?._id === profile._id} 
          onFollow={handleFollow} 
        />
        
        <div className="border-t border-extraLight">
          <div className="p-4 font-bold text-lg">Tweets</div>
          {tweets.length === 0 ? (
            <div className="p-6 text-center text-dark">No tweets yet</div>
          ) : (
            tweets.map(tweet => (
              <Tweet key={tweet._id} tweet={tweet} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
