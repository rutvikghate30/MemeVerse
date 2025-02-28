import React from 'react';
import { motion } from 'framer-motion';
import { Meme } from '../../types';
import MemeCard from './MemeCard';
import { Loader } from 'lucide-react';

interface MemeGridProps {
  memes: Meme[];
  loading?: boolean;
  emptyMessage?: string;
}

const MemeGrid: React.FC<MemeGridProps> = ({
  memes,
  loading = false,
  emptyMessage = 'No memes found',
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin text-yellow-600 dark:text-yellow-400" size={40} />
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {memes.map((meme, index) => (
        <MemeCard key={meme.id} meme={meme} index={index} />
      ))}
    </motion.div>
  );
};

export default MemeGrid;