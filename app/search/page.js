
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '@/components/Layout';
import Tweet from '@/components/Tweet';
import UserCard from '@/components/UserCard';
import { FaSearch } from 'react-icons/fa';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [activeTab, setActiveTab] = useState('tweets');
  const [tweets, setTweets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (q) => {
    if (!q.trim()) return;
    
    setLoading(true);
    try {
      const tweetsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search/tweets?q=${q}`);
      setTweets(tweetsRes.data);
      
      const usersRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search/users?q=${q}`);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Search failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
    
    // Update URL with search query
    const url = new URL(window.location);
    url.searchParams.set('q', searchQuery);
    window.history.pushState({}, '', url);
  };

  return (
    <Layout>
      <div className="flex-1 border-x border-extraLight">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 border-b border-extraLight">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Chirp"
              className="w-full p-3 pl-10 bg-ultraLight rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <FaSearch className="absolute left-3 top-3.5 text-dark" />
            <button type="submit" className="hidden">Search</button>
          </form>
          
          <div className="flex border-b border-extraLight">
            <button
              onClick={() => setActiveTab('tweets')}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === 'tweets' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-dark hover:bg-ultraLight'
              }`}
            >
              Tweets
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === 'users' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-dark hover:bg-ultraLight'
              }`}
            >
              People
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {activeTab === 'tweets' && (
              <div>
                {tweets.length === 0 ? (
                  <div className="p-6 text-center text-dark">
                    {query ? 'No tweets found matching your search' : 'Search for tweets'}
                  </div>
                ) : (
                  tweets.map(tweet => (
                    <Tweet key={tweet._id} tweet={tweet} />
                  ))
                )}
              </div>
            )}
            
            {activeTab === 'users' && (
              <div>
                {users.length === 0 ? (
                  <div className="p-6 text-center text-dark">
                    {query ? 'No users found matching your search' : 'Search for people'}
                  </div>
                ) : (
                  users.map(user => (
                    <UserCard key={user._id} user={user} />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
