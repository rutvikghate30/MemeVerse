"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { fetchMemes, searchMemes } from "../../store/memesSlice";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import Link from "next/link";
// Import React Icons for Trending, Likes, and Search
import { FiTrendingUp } from "react-icons/fi";
import { FaThumbsUp, FaSearch, FaRegCommentDots } from "react-icons/fa";
import Image from "next/image";
export default function ExplorePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { memes, status, error } = useSelector((state: RootState) => state.memes);
  const [category, setCategory] = useState("trending");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("likes");
  const [page, setPage] = useState(1);
  const [minLikes, setMinLikes] = useState(0);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      dispatch(searchMemes(term));
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      dispatch(fetchMemes({ category, page, sortBy }));
    }
  }, [category, page, sortBy, searchTerm, dispatch, debouncedSearch]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Prepare memes with simulated likes if necessary and filter based on minLikes.
  const filteredMemes = useMemo(() => {
    return memes
      .map((meme: any) => {
        const simulatedLikes =
          meme.likes !== undefined ? meme.likes : Math.floor(Math.random() * 1000);
        return {
          ...meme,
          simulatedLikes,
          comments: Array.isArray(meme.comments) ? meme.comments : [],
        };
      })
      .filter((meme: any) => meme.simulatedLikes >= minLikes);
  }, [memes, minLikes]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-transparent bg-clip-text text-center"
      >
        Explore Memes
      </motion.h1>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8 flex flex-wrap gap-4 justify-center"
      >
        {/* Category select with enhanced styling */}
        <div className="flex items-center gap-2 group">
          <FiTrendingUp size={20} className="text-black dark:text-white group-hover:text-yellow-500 transition-colors duration-300" />
          <select
            className="dark:text-white bg-white/10 border-gray-700 drop-shadow-xl 
            dark:hover:bg-gray-800 hover:border-yellow-500 transition-all duration-300 
            p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option className="dark:bg-gray-700" value="trending">
              Trending
            </option>
            <option className="dark:bg-gray-700" value="new">
              New
            </option>
            <option className="dark:bg-gray-700" value="classic">
              Classic
            </option>
            <option className="dark:bg-gray-700" value="random">
              Random
            </option>
          </select>
        </div>

        {/* Sort select with enhanced styling */}
        <div className="flex items-center gap-2 group">
          <FaThumbsUp size={20} className="text-black dark:text-white group-hover:text-yellow-500 transition-colors duration-300" />
          <select
            className="bg-slate-50 dark:text-white dark:bg-white/10 border-gray-700 
            drop-shadow-xl dark:hover:bg-gray-800 hover:border-yellow-500 transition-all 
            duration-300 p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option className="dark:bg-gray-700" value="likes">
              Likes
            </option>
            <option className="dark:bg-gray-700" value="date">
              Date
            </option>
            <option className="dark:bg-gray-700" value="comments">
              Comments
            </option>
          </select>
        </div>

        {/* Search input with enhanced styling */}
        <div className="flex items-center gap-2 group">
          <FaSearch size={20} className="text-black dark:text-white group-hover:text-yellow-500 transition-colors duration-300" />
          <input
            type="text"
            placeholder="Search memes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2.5 border-gray-700 drop-shadow-xl bg-white/10 
            dark:hover:bg-white/30 transition-all duration-300 border rounded-lg 
            text-black placeholder-gray-500 focus:outline-none focus:ring-2 
            focus:ring-yellow-500 hover:border-yellow-500"
          />
        </div>
      </motion.div>

      {status === "loading" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center py-8"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </motion.div>
      )}

      {status === "failed" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-center py-8"
        >
          Error: {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, staggerChildren: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {filteredMemes.map((meme: any) => (
          <motion.div
            key={meme.id}
            className="bg-white dark:bg-gray-700/90 p-2 border-2 dark:border-transparent 
            border-gray-700 rounded-xl drop-shadow-2xl shadow-lg hover:shadow-yellow-200/50 
            overflow-hidden backdrop-blur-sm"
            whileHover={{ 
              scale: 1.03,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href={`/meme/${meme.id}`}>
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={meme.url || "/placeholder.svg"}
                  alt={meme.name}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-3 line-clamp-1">{meme.name}</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm">
                    <FaThumbsUp size={16} className="text-yellow-500" />
                    <span>{meme.simulatedLikes.toLocaleString()}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <FaRegCommentDots size={16} className="text-yellow-500" />
                    <span>{meme.comments.length > 0 ? meme.comments.length.toLocaleString() : "No comments"}</span>
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
