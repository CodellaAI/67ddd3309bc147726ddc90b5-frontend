
'use client';
import { useRef, useEffect } from 'react';
import TweetComposer from './TweetComposer';
import { FaTimes } from 'react-icons/fa';

export default function TweetModal({ onClose }) {
  const modalRef = useRef(null);

  const handleNewTweet = (newTweet) => {
    // Refresh the page or update state
    window.location.reload();
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-auto"
      >
        <div className="p-2 border-b border-extraLight sticky top-0 bg-white">
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-ultraLight"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-4">
          <TweetComposer onTweetAdded={handleNewTweet} />
        </div>
      </div>
    </div>
  );
}
