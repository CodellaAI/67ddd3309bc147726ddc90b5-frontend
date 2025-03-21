
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '@/components/Layout';
import Tweet from '@/components/Tweet';
import CommentForm from '@/components/CommentForm';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function TweetPage() {
  const { id } = useParams();
  const [tweet, setTweet] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTweetAndComments = async () => {
      try {
        const tweetRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tweets/${id}`);
        setTweet(tweetRes.data);
        
        const commentsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tweets/${id}/comments`);
        setComments(commentsRes.data);
      } catch (error) {
        toast.error('Failed to load tweet');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTweetAndComments();
    }
  }, [id]);

  const handleAddComment = (newComment) => {
    setComments(prev => [newComment, ...prev]);
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

  if (!tweet) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl text-dark">Tweet not found</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 border-x border-extraLight">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 border-b border-extraLight flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-4 p-2 rounded-full hover:bg-ultraLight"
          >
            <FaArrowLeft className="text-dark" />
          </button>
          <h1 className="text-xl font-bold">Tweet</h1>
        </div>
        
        <div className="pb-2">
          <Tweet tweet={tweet} isDetailPage={true} />
        </div>
        
        {user && (
          <div className="border-t border-b border-extraLight p-4">
            <CommentForm tweetId={id} onCommentAdded={handleAddComment} />
          </div>
        )}
        
        <div>
          {comments.length === 0 ? (
            <div className="p-6 text-center text-dark">No comments yet</div>
          ) : (
            comments.map(comment => (
              <Tweet key={comment._id} tweet={comment} isComment={true} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
