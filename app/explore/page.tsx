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
    transition={{ duration: 0.6 }}
    className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-orange-400 text-transparent bg-clip-text text-center">
        Explore Memes
      </h1>
      <div className="mb-6 flex flex-wrap gap-4">
        {/* Category select with Trending Icon */}
        <div className="flex items-center gap-2">
          <FiTrendingUp size={20} className="text-black dark:text-white" />
          <select
            className="dark:*:text-white bg-white/10 border-gray-700 drop-shadow-xl dark:hover:bg-gray-800 transition-all p-2 border rounded"
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

        {/* Sort select with Likes Icon */}
        <div className="flex items-center gap-2">
          <FaThumbsUp size={20} className="text-black dark:text-white" />
          <select
            className="bg-slate-50 dark:text-white dark:bg-white/10 border-gray-700 drop-shadow-xl dark:hover:bg-gray-800 transition-all p-2 border rounded"
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

        {/* Search input with Search Icon */}
        <div className="flex items-center gap-2">
          <FaSearch size={20} className="text-black dark:text-white" />
          <input
            type="text"
            placeholder="Search memes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border-gray-700 drop-shadow-xl bg-white/10 dark:hover:bg-white/30 transition-all border rounded text-black"
          />
        </div>
      </div>
      {status === "loading" && <div>Loading...</div>}
      {status === "failed" && <div>Error: {error}</div>}
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMemes.map((meme: any) => (
          <motion.div
            key={meme.id}
            className="bg-white dark:bg-gray-700 p-1 border-2 dark:border-transparent border-gray-700 rounded-lg drop-shadow-2xl shadow-md shadow-yellow-100 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={`/meme/${meme.id}`}>
              <Image
                src={meme.url || "/placeholder.svg"}
                alt={meme.name}
                width={400}
                height={250}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{meme.name}</h3>
                <p className=" flex justify-start mb-1 items-center gap-2"><FaThumbsUp size={20} className="text-black dark:text-white" /> {meme.simulatedLikes}</p>
                <p className=" flex justify-start mb-1 items-center gap-2">
                <FaRegCommentDots size={20} className="text-black dark:text-white" />{" "}
                  {meme.comments.length > 0 ? meme.comments.length : "No comments"}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
