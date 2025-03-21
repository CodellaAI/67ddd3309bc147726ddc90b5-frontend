
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TweetComposer from './TweetComposer';
import Tweet from './Tweet';
import { useAuth } from '@/context/AuthContext';

export default function Feed() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async (refresh = false) => {
    try {
      const currentPage = refresh ? 1 : page;
      setLoading(true);
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tweets?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (refresh || currentPage === 1) {
        setTweets(response.data);
      } else {
        setTweets(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.data.length === 10); // Assuming 10 is the page size
      setPage(currentPage + 1);
    } catch (error) {
      toast.error('Failed to load tweets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTweet = (newTweet) => {
    setTweets(prev => [newTweet, ...prev]);
  };

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && hasMore && !loading) {
      fetchTweets();
    }
  };

  return (
    <div onScroll={handleScroll} className="overflow-y-auto">
      {user && <TweetComposer onTweetAdded={handleNewTweet} />}
      
      <div className="border-t border-extraLight">
        {tweets.length === 0 && !loading ? (
          <div className="p-6 text-center text-dark">
            No tweets to display. Follow some users to see their tweets!
          </div>
        ) : (
          tweets.map(tweet => (
            <Tweet key={tweet._id} tweet={tweet} />
          ))
        )}
        
        {loading && (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
}
