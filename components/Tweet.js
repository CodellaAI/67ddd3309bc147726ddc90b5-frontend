
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { 
  FaRegComment, 
  FaRetweet, 
  FaRegHeart, 
  FaHeart, 
  FaShareAlt, 
  FaTrash, 
  FaEllipsisH 
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

export default function Tweet({ tweet, isDetailPage = false, isComment = false }) {
  const [liked, setLiked] = useState(tweet.isLiked || false);
  const [likesCount, setLikesCount] = useState(tweet.likes?.length || 0);
  const [retweeted, setRetweeted] = useState(tweet.isRetweeted || false);
  const [retweetsCount, setRetweetsCount] = useState(tweet.retweets?.length || 0);
  const [showOptions, setShowOptions] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();
  
  const isAuthor = user && tweet.user?._id === user._id;
  
  const handleTweetClick = (e) => {
    // Prevent navigation if clicking on links, buttons, or other interactive elements
    if (
      e.target.tagName === 'BUTTON' || 
      e.target.tagName === 'A' || 
      e.target.closest('button') || 
      e.target.closest('a')
    ) {
      return;
    }
    
    if (!isDetailPage) {
      router.push(`/tweet/${tweet._id}`);
    }
  };
  
  const handleLike = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      toast.info('Please log in to like tweets');
      return;
    }
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tweets/${tweet._id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setLiked(!liked);
      setLikesCount(prev => liked ? prev - 1 : prev + 1);
    } catch (error) {
      toast.error('Failed to like tweet');
      console.error(error);
    }
  };
  
  const handleRetweet = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      toast.info('Please log in to retweet');
      return;
    }
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tweets/${tweet._id}/retweet`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setRetweeted(!retweeted);
      setRetweetsCount(prev => retweeted ? prev - 1 : prev + 1);
      
      if (!retweeted) {
        toast.success('Retweeted!');
      }
    } catch (error) {
      toast.error('Failed to retweet');
      console.error(error);
    }
  };
  
  const handleDelete = async (e) => {
    e.stopPropagation();
    
    if (!isAuthor) return;
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/tweets/${tweet._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.success('Tweet deleted');
      
      // If on detail page, navigate back
      if (isDetailPage) {
        router.push('/');
      } else {
        // Otherwise, let's refresh the page
        window.location.reload();
      }
    } catch (error) {
      toast.error('Failed to delete tweet');
      console.error(error);
    }
  };
  
  const toggleOptions = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };
  
  if (!tweet || !tweet.user) {
    return null;
  }
  
  return (
    <div 
      className={`tweet-card ${isDetailPage ? 'border-none' : ''}`}
      onClick={handleTweetClick}
    >
      <div className="flex">
        <div className="mr-3">
          <Link href={`/profile/${tweet.user.username}`} onClick={e => e.stopPropagation()}>
            <img 
              src={tweet.user.profilePicture || "https://via.placeholder.com/40"} 
              alt={tweet.user.name} 
              className="w-10 h-10 rounded-full"
            />
          </Link>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 truncate">
              <Link 
                href={`/profile/${tweet.user.username}`} 
                className="font-bold hover:underline"
                onClick={e => e.stopPropagation()}
              >
                {tweet.user.name}
              </Link>
              <span className="text-dark">@{tweet.user.username}</span>
              <span className="text-dark">·</span>
              <span className="text-dark" title={new Date(tweet.createdAt).toLocaleString()}>
                {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
              </span>
            </div>
            
            <div className="relative">
              <button 
                onClick={toggleOptions}
                className="p-2 text-dark rounded-full hover:bg-ultraLight hover:text-primary"
              >
                <FaEllipsisH />
              </button>
              
              {showOptions && (
                <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg py-1 z-10 w-40">
                  {isAuthor && (
                    <button 
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-ultraLight flex items-center"
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {tweet.replyTo && !isComment && (
            <div className="text-dark text-sm mb-1">
              Replying to{' '}
              <Link 
                href={`/profile/${tweet.replyTo.user.username}`}
                className="text-primary hover:underline"
                onClick={e => e.stopPropagation()}
              >
                @{tweet.replyTo.user.username}
              </Link>
            </div>
          )}
          
          <div className={`${isDetailPage ? 'text-xl mb-4' : 'mb-2'}`}>
            {tweet.content}
          </div>
          
          {tweet.image && (
            <div className="mb-3">
              <img 
                src={tweet.image} 
                alt="Tweet media" 
                className="rounded-xl max-h-80 w-auto"
              />
            </div>
          )}
          
          <div className="flex justify-between max-w-md mt-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (!isDetailPage) router.push(`/tweet/${tweet._id}`);
              }}
              className="flex items-center text-dark hover:text-primary group"
            >
              <div className="p-2 group-hover:bg-blue-50 rounded-full mr-1">
                <FaRegComment />
              </div>
              <span>{tweet.comments?.length || 0}</span>
            </button>
            
            <button 
              onClick={handleRetweet}
              className={`flex items-center ${retweeted ? 'text-green-500' : 'text-dark hover:text-green-500'} group`}
            >
              <div className="p-2 group-hover:bg-green-50 rounded-full mr-1">
                <FaRetweet />
              </div>
              <span>{retweetsCount}</span>
            </button>
            
            <button 
              onClick={handleLike}
              className={`flex items-center ${liked ? 'text-red-500' : 'text-dark hover:text-red-500'} group`}
            >
              <div className="p-2 group-hover:bg-red-50 rounded-full mr-1">
                {liked ? <FaHeart /> : <FaRegHeart />}
              </div>
              <span>{likesCount}</span>
            </button>
            
            <button 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center text-dark hover:text-primary group"
            >
              <div className="p-2 group-hover:bg-blue-50 rounded-full">
                <FaShareAlt />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
