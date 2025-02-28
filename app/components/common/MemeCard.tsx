import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Meme } from '../../types';
import { useMeme } from '../../context/MemeContext';
import { formatDistanceToNow } from 'date-fns';

interface MemeCardProps {
  meme: Meme;
  index: number;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, index }) => {
  const { likeMeme, isMemeliked } = useMeme();
  const isLiked = isMemeliked(meme.id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likeMeme(meme.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a real app, this would use the Web Share API
    if (navigator.share) {
      navigator.share({
        title: meme.title,
        text: `Check out this meme: ${meme.title}`,
        url: window.location.origin + `/meme/${meme.id}`,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(
        window.location.origin + `/meme/${meme.id}`
      );
      alert('Link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <Link to={`/meme/${meme.id}`} className="block">
        <div className="relative pb-[100%] overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img
            src={meme.url}
            alt={meme.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            loading="lazy"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {meme.title}
          </h3>
          
          <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>
              {meme.createdAt
                ? formatDistanceToNow(new Date(meme.createdAt), { addSuffix: true })
                : 'Recently'}
            </span>
            <span className="mx-2">•</span>
            <span>{meme.category || 'Uncategorized'}</span>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                isLiked
                  ? 'text-red-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500'
              } transition-colors`}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart
                size={18}
                className={isLiked ? 'fill-current' : ''}
              />
              <span>{meme.likes || 0}</span>
            </button>
            
            <Link
              to={`/meme/${meme.id}`}
              className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-500 transition-colors"
              aria-label="Comments"
            >
              <MessageCircle size={18} />
              <span>{meme.comments?.length || 0}</span>
            </Link>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-500 transition-colors"
              aria-label="Share"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MemeCard;