
'use client';
import { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaImage, FaSmile, FaPoll, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function TweetComposer({ onTweetAdded, replyTo = null }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !image) {
      toast.error('Tweet cannot be empty');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }
      if (replyTo) {
        formData.append('replyTo', replyTo);
      }
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tweets`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setContent('');
      setImage(null);
      setImagePreview('');
      
      toast.success(replyTo ? 'Reply posted!' : 'Tweet posted!');
      
      if (onTweetAdded) {
        onTweetAdded(response.data);
      }
    } catch (error) {
      toast.error('Failed to post tweet');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
    fileInputRef.current.value = '';
  };

  return (
    <div className="p-4 border-b border-extraLight">
      <div className="flex">
        <img 
          src={user?.profilePicture || "https://via.placeholder.com/40"} 
          alt={user?.name || "User"} 
          className="w-12 h-12 rounded-full mr-4"
        />
        
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={replyTo ? "Tweet your reply" : "What's happening?"}
              className="w-full border-none focus:outline-none resize-none text-lg mb-3 min-h-[80px]"
              maxLength={280}
            />
            
            {imagePreview && (
              <div className="relative mb-4">
                <img src={imagePreview} alt="Preview" className="rounded-2xl max-h-80 w-auto" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1"
                >
                  &times;
                </button>
              </div>
            )}
            
            <div className="flex justify-between items-center border-t border-extraLight pt-3">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-primary p-2 rounded-full hover:bg-blue-50"
                >
                  <FaImage />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                
                <button type="button" className="text-primary p-2 rounded-full hover:bg-blue-50">
                  <FaSmile />
                </button>
                
                <button type="button" className="text-primary p-2 rounded-full hover:bg-blue-50">
                  <FaPoll />
                </button>
                
                <button type="button" className="text-primary p-2 rounded-full hover:bg-blue-50">
                  <FaCalendarAlt />
                </button>
                
                <button type="button" className="text-primary p-2 rounded-full hover:bg-blue-50">
                  <FaMapMarkerAlt />
                </button>
              </div>
              
              <div className="flex items-center">
                {content.length > 0 && (
                  <div className={`mr-3 text-sm ${content.length > 260 ? 'text-orange-500' : 'text-dark'}`}>
                    {280 - content.length}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading || (!content.trim() && !image)}
                  className={`btn-primary px-5 ${loading || (!content.trim() && !image) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Posting...' : replyTo ? 'Reply' : 'Tweet'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
