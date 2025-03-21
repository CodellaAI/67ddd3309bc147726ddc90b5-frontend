
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import UserCard from './UserCard';

export default function Widgets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Mock trending topics
    setTrendingTopics([
      { id: 1, name: '#JavaScript', tweetCount: '24.5K' },
      { id: 2, name: '#ReactJS', tweetCount: '18.2K' },
      { id: 3, name: '#NextJS', tweetCount: '12.7K' },
      { id: 4, name: '#TailwindCSS', tweetCount: '9.3K' },
      { id: 5, name: '#WebDevelopment', tweetCount: '32.1K' },
    ]);

    // Fetch suggested users
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/suggested`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSuggestedUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch suggested users', error);
      }
    };

    fetchSuggestedUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <form onSubmit={handleSearch} className="relative">
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
      
      <div className="bg-ultraLight rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-4">What's happening</h2>
        {trendingTopics.map(topic => (
          <div key={topic.id} className="py-3 hover:bg-extraLight cursor-pointer px-2 rounded-lg">
            <div className="text-dark text-sm">Trending</div>
            <div className="font-bold">{topic.name}</div>
            <div className="text-dark text-sm">{topic.tweetCount} Tweets</div>
          </div>
        ))}
        <button className="text-primary hover:bg-blue-50 w-full text-left p-3 rounded-lg mt-1">
          Show more
        </button>
      </div>
      
      <div className="bg-ultraLight rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-4">Who to follow</h2>
        {suggestedUsers.map(user => (
          <UserCard key={user._id} user={user} />
        ))}
        <button className="text-primary hover:bg-blue-50 w-full text-left p-3 rounded-lg mt-1">
          Show more
        </button>
      </div>
      
      <div className="text-dark text-sm">
        <span className="mr-2 hover:underline cursor-pointer">Terms of Service</span>
        <span className="mr-2 hover:underline cursor-pointer">Privacy Policy</span>
        <span className="mr-2 hover:underline cursor-pointer">Cookie Policy</span>
        <span className="mr-2 hover:underline cursor-pointer">Accessibility</span>
        <span className="mr-2 hover:underline cursor-pointer">Ads info</span>
        <span className="hover:underline cursor-pointer">More</span>
        <div className="mt-1">© 2023 Chirp, Inc.</div>
      </div>
    </div>
  );
}
