"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import { fetchMemeDetails, likeMeme } from "../../../store/memesSlice";
import { FaThumbsUp, FaShareAlt } from "react-icons/fa";
import Image from "next/image";

export default function MemeDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { memeDetails, status, error } = useSelector(
    (state: RootState) => state.memes
  ) as {
    memeDetails: { name: string; url: string; likes: number; comments: string[] } | null;
    status: string;
    error: string | null;
  };

  // Local state for new comment input, stored comments, and liked status.
  const [comment, setComment] = useState("");
  const [storedComments, setStoredComments] = useState<string[]>([]);
  const [liked, setLiked] = useState(false);

  // Load meme details from Redux.
  useEffect(() => {
    if (id) {
      dispatch(fetchMemeDetails(id as string));
    }
  }, [id, dispatch]);

  // Load stored comments and liked status from localStorage when the meme id changes.
  useEffect(() => {
    if (id) {
      const savedComments = localStorage.getItem(`comments-${id}`);
      if (savedComments) {
        setStoredComments(JSON.parse(savedComments));
      }
      const savedLiked = localStorage.getItem(`liked-${id}`);
      if (savedLiked) {
        setLiked(JSON.parse(savedLiked));
      }
    }
  }, [id]);

  const handleLike = () => {
    if (id) {
      dispatch(likeMeme(id as string));
      // Toggle like status locally and store in localStorage
      setLiked((prev) => {
        const newLiked = !prev;
        localStorage.setItem(`liked-${id}`, JSON.stringify(newLiked));
        
        // Store liked meme ID in localStorage for profile page
        const likedMemes = JSON.parse(localStorage.getItem('likedMemes') || '[]');
        if (newLiked) {
          if (!likedMemes.includes(id)) {
            likedMemes.push(id);
          }
        } else {
          const index = likedMemes.indexOf(id);
          if (index > -1) {
            likedMemes.splice(index, 1);
          }
        }
        localStorage.setItem('likedMemes', JSON.stringify(likedMemes));
        
        return newLiked;
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && id) {
      const newComment = comment.trim();
      const updatedComments = [...storedComments, newComment];
      setStoredComments(updatedComments);
      localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
      setComment("");
    }
  };

  const handleShare = async () => {
    if (memeDetails && memeDetails.url) {
      try {
        await navigator.clipboard.writeText(memeDetails.url);
        alert("Meme URL copied to clipboard!");
      } catch (err) {
        alert("Failed to copy meme URL.");
      }
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;
  if (!memeDetails)
    return (
      <div className="flex justify-center items-center text-4xl bg-gradient-to-r from-yellow-600 to-orange-400 text-transparent bg-clip-text">
        Meme not found
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-3xl md:text-4xl text-center bg-gradient-to-r from-yellow-600 to-orange-400 text-transparent bg-clip-text font-bold mb-8"
      >
        {memeDetails.name}
      </motion.h1>
      
      <motion.div 
        className="mb-8 relative rounded-xl overflow-hidden shadow-2xl"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={memeDetails.url || "/placeholder.svg"}
          alt={memeDetails.name}
          className="object-contain w-full"
          width={800}
          height={600}
        />
      </motion.div>

      <div className="flex items-center justify-center space-x-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={liked ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
          onClick={handleLike}
          className={`${
            liked ? 'bg-pink-600' : 'bg-red-500'
          } text-white px-6 py-3 rounded-full flex items-center gap-3 transition-all duration-300 hover:shadow-lg`}
        >
          <motion.div
            animate={liked ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <FaThumbsUp className={`${liked ? 'text-yellow-300' : ''}`} />
          </motion.div>
          {liked ? 'Liked!' : 'Like'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="bg-blue-500 text-white px-6 py-3 rounded-full flex items-center gap-3 transition-all duration-300 hover:bg-blue-600 hover:shadow-lg"
        >
          <FaShareAlt />
          Share
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-600 to-orange-400 text-transparent bg-clip-text">Comments</h2>
        
        {storedComments.length > 0 && (
          <div className="mb-6 space-y-3">
            {storedComments.map((storedComment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg mx-auto max-w-2xl transition-all rounded-lg p-4"
              >
                {storedComment}
              </motion.div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddComment} className="max-w-2xl mx-auto">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 text-black border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            rows={3}
            placeholder="Add a comment..."
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="mt-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            Add Comment
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
