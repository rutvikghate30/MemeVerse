import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, Star, Shuffle } from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const categories = [
    { id: 'trending', name: 'Trending', icon: <Flame size={18} /> },
    { id: 'new', name: 'New', icon: <Clock size={18} /> },
    { id: 'classic', name: 'Classic', icon: <Star size={18} /> },
    { id: 'random', name: 'Random', icon: <Shuffle size={18} /> },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-colors ${
            activeCategory === category.id
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {category.icon}
          <span>{category.name}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;