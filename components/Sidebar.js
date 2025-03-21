
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaTwitter, 
  FaHome, 
  FaSearch, 
  FaBell, 
  FaEnvelope, 
  FaBookmark, 
  FaList, 
  FaUser, 
  FaEllipsisH,
  FaFeatherAlt
} from 'react-icons/fa';

export default function Sidebar({ openTweetModal }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="flex flex-col h-full justify-between p-4">
      <div>
        <div className="p-2 mb-4">
          <Link href="/" className="text-primary hover:bg-blue-50 p-3 rounded-full inline-block">
            <FaTwitter className="text-3xl" />
          </Link>
        </div>
        
        <nav className="space-y-2">
          <Link href="/" className="flex items-center p-3 text-xl rounded-full hover:bg-ultraLight transition duration-200">
            <FaHome className="mr-4" />
            <span className="hidden xl:inline">Home</span>
          </Link>
          
          <Link href="/search" className="flex items-center p-3 text-xl rounded-full hover:bg-ultraLight transition duration-200">
            <FaSearch className="mr-4" />
            <span className="hidden xl:inline">Explore</span>
          </Link>
          
          {user && (
            <>
              <Link href="/notifications" className="flex items-center p-3 text-xl rounded-full hover:bg-ultraLight transition duration-200">
                <FaBell className="mr-4" />
                <span className="hidden xl:inline">Notifications</span>
              </Link>
              
              <Link href="/messages" className="flex items-center p-3 text-xl rounded-full hover:bg-ultraLight transition duration-200">
                <FaEnvelope className="mr-4" />
                <span className="hidden xl:inline">Messages</span>
              </Link>
              
              <Link href="/bookmarks" className="flex items-center p-3 text-xl rounded-full hover:bg-ultraLight transition duration-200">
                <FaBookmark className="mr-4" />
                <span className="hidden xl:inline">Bookmarks</span>
              </Link>
              
              <Link href="/lists" className="flex items-center p-3 text-xl rounded-full hover:bg-ultraLight transition duration-200">
                <FaList className="mr-4" />
                <span className="hidden xl:inline">Lists</span>
              </Link>
              
              <Link href={`/profile/${user.username}`} className="flex items-center p-3 text-xl rounded-full hover:bg-ultraLight transition duration-200">
                <FaUser className="mr-4" />
                <span className="hidden xl:inline">Profile</span>
              </Link>
              
              <button className="flex items-center p-3 text-xl rounded-full hover:bg-ultraLight transition duration-200 w-full text-left">
                <FaEllipsisH className="mr-4" />
                <span className="hidden xl:inline">More</span>
              </button>
            </>
          )}
        </nav>
        
        {user && (
          <button 
            onClick={openTweetModal}
            className="mt-4 bg-primary text-white rounded-full p-3 xl:p-4 w-full font-bold hover:bg-blue-600 transition duration-200 flex items-center justify-center xl:justify-start"
          >
            <FaFeatherAlt className="xl:hidden" />
            <span className="hidden xl:inline">Tweet</span>
          </button>
        )}
      </div>
      
      {user && (
        <div className="mt-auto">
          <div className="flex items-center p-3 rounded-full hover:bg-ultraLight cursor-pointer">
            <img 
              src={user.profilePicture || "https://via.placeholder.com/40"} 
              alt={user.name} 
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="hidden xl:block">
              <div className="font-bold">{user.name}</div>
              <div className="text-dark">@{user.username}</div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="mt-2 text-red-500 p-3 rounded-full hover:bg-red-50 transition duration-200 w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
