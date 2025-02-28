"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchTrendingMemes } from "../store/memesSlice";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import haha from "./assets/haha.png";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { trendingMemes, status, error } = useSelector(
    (state: RootState) => state.memes
  );

  useEffect(() => {
    dispatch(fetchTrendingMemes());
  }, [dispatch]);

  return (
    <main className="container mx-auto px-4 py-8 dark:bg-slate-900">
      <div className="container mx-auto px-4 min-h-screen flex justify-center items-center flex-col relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center flex justify-around lg:flex-row flex-col-reverse items-center mx-auto gap-12"
        >
          <div className="max-w-3xl flex flex-col justify-start items-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-orange-400 text-transparent bg-clip-text"
            >
              Welcome to MemeVerse
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8"
            >
              Your one-stop destination for exploring, creating, and sharing the internet's best memes. Dive into a dynamic collection of hilarious, thought-provoking, and viral content curated just for you.
            </motion.p>
          </div>
          <div className="right">
            <Image src={haha} alt="Home Page img" width={500} height={500} />
          </div>
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-3xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-orange-500 text-transparent bg-clip-text"
      >
        Trending Memes
      </motion.h2>

      {status === "loading" && <div className="text-center mt-10">Loading...</div>}
      {status === "failed" && <div className="text-center mt-10 text-red-500">Error: {error}</div>}

      {status === "succeeded" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {trendingMemes.map((meme) => (
            <motion.div
              key={meme.id}
              className="bg-white dark:bg-gray-700 p-1 border-2 dark:border-transparent border-gray-700 rounded-lg drop-shadow-2xl shadow-md shadow-yellow-100 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/meme/${meme.id}`}>
                <img
                  src={meme.url || "/placeholder.svg"}
                  alt={meme.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{meme.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-10 text-center flex lg:flex-row flex-col-reverse justify-center items-center gap-4"
      >
        <Link
          href="/explore"
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:bg-gradient-to-l duration-500 hover:scale-105 hover:from-yellow-400 hover:to-yellow-600 transition-all text-black font-extrabold text-xl py-2 px-4 rounded"
        >
          Explore More Memes
        </Link>
        <Image src={monkey} alt="Home Page img" width={400} height={400} />
      </motion.div>
    </main>
  );
}
