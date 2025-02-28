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
      // Toggle like status locally and store in localStorage.
      setLiked((prev) => {
        const newLiked = !prev;
        localStorage.setItem(`liked-${id}`, JSON.stringify(newLiked));
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
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl bg-gradient-to-r from-yellow-600 to-orange-400 text-transparent bg-clip-text font-bold mb-6">
        {memeDetails.name}
      </h1>
      <div className="mb-6">
        <Image
          src={memeDetails.url || "/placeholder.svg"}
          alt={memeDetails.name}
          className="object-contain"
          width={500}
          height={300}
        />
      </div>
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1, rotate: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors duration-200 hover:bg-pink-700 hover:text-yellow-300"
        >
          <FaThumbsUp />
          {liked ? "Liked" : "Like"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors duration-200 hover:bg-blue-600 hover:text-yellow-300"
        >
          <FaShareAlt />
          Share
        </motion.button>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {/* Display stored comments above the comment textarea */}
        {storedComments.length > 0 && (
          <div className="mb-4 space-y-2">
            {storedComments.map((storedComment, index) => (
              <div
                key={index}
                className="bg-gray-200 border border-gray-600 hover:scale-105 mx-24 transition-all dark:bg-gray-800/40 p-4 rounded"
              >
                {storedComment}
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleAddComment} className="mb-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-3/4 p-2 lg:mx-24 text-black border rounded"
            rows={3}
            placeholder="Add a comment..."
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded mt-2 transition-colors duration-200 hover:bg-green-600"
          >
            Add Comment
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
