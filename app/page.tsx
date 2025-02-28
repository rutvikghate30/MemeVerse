"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchTrendingMemes } from "../store/memesSlice";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import haha from "./assets/haha.png";
import monkey from "./assets/monkey.png";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { trendingMemes, status, error } = useSelector(
    (state: RootState) => state.memes
  );

  useEffect(() => {
    dispatch(fetchTrendingMemes());
  }, [dispatch]);

  return (
    <main className="container mx-auto px-4 py-12 dark:bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 flex justify-center items-center flex-col relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center flex justify-around lg:flex-row flex-col-reverse items-center mx-auto gap-16"
        >
          <div className="max-w-3xl flex flex-col justify-start items-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-yellow-500 via-orange-400 to-orange-500 text-transparent bg-clip-text leading-tight"
            >
              Welcome to MemeVerse
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl"
            >
              Your premier platform for discovering, creating, and sharing the internet's finest memes. Experience a curated collection of viral content tailored to your interests.
            </motion.p>
          </div>
          <motion.div
            className="right"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image 
              src={haha} 
              alt="MemeVerse Illustration" 
              width={500} 
              height={500}
              className="drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold my-16 bg-gradient-to-r from-yellow-500 via-orange-400 to-orange-500 text-transparent bg-clip-text text-center"
      >
        Trending Memes
      </motion.h2>

      {status === "loading" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-10 text-xl"
        >
          Loading...
        </motion.div>
      )}
      
      {status === "failed" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-10 text-red-500 text-xl"
        >
          Error: {error}
        </motion.div>
      )}

      {status === "succeeded" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {trendingMemes.map((meme, index) => (
            <motion.div
              key={meme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
            >
              <Link href={`/meme/${meme.id}`} className="block">
                <div className="overflow-hidden rounded-lg">
                  <motion.img
                    src={meme.url || "/placeholder.svg"}
                    alt={meme.name}
                    className="w-full h-52 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xl mb-2 dark:text-gray-100">{meme.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mt-20 mb-10 text-center flex lg:flex-row flex-col-reverse justify-center items-center gap-8"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href="/explore"
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:bg-gradient-to-l text-black font-bold text-xl py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore More Memes
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Image 
            src={monkey} 
            alt="Decorative Illustration" 
            width={400} 
            height={400}
            className="drop-shadow-xl"
          />
        </motion.div>
      </motion.div>
    </main>
  );
}
