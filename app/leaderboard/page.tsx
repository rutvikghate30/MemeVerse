"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../store"
import { fetchLeaderboard } from "../../store/leaderboardSlice"
import Link from "next/link"

interface User {
  id: string;
  profilePicture?: string;
  name: string;
  engagementScore: number;
}

interface Meme {
  id: string;
  url?: string;
  name: string;
  likes: number;
}

export default function LeaderboardPage() {
  const dispatch = useDispatch<AppDispatch>()

  // ✅ Move useSelector inside the component
  const leaderboard = useSelector((state: RootState) => state.leaderboard)

  const { topMemes, topUsers, status, error } = leaderboard as { topMemes: Meme[], topUsers: User[], status: string, error: string }

  useEffect(() => {
    dispatch(fetchLeaderboard())
  }, [dispatch])

  if (status === "loading") return <div>Loading...</div>
  if (status === "failed") return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-orange-500 text-transparent bg-clip-text text-center">Leaderboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400">Top 10 Memes</h2>
          {topMemes.map((meme, index) => (
            <motion.div
              key={meme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md mb-4"
            >
              <Link href={`/meme/${meme.id}`}>
                <div className="flex items-center p-4">
                  <span className="text-2xl font-bold mr-4 text-blue-600 dark:text-blue-400">{index + 1}</span>
                  <img
                    src={meme.url || "/placeholder.svg"}
                    alt={meme.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{meme.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">Likes: {meme.likes}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Top Users</h2>
          {topUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md mb-4"
            >
              <div className="flex items-center p-4">
                <span className="text-2xl font-bold mr-4 text-green-600 dark:text-green-400">{index + 1}</span>
                <img
                  src={user.profilePicture || "/placeholder-user.jpg"}
                  alt={user.name}
                  className="w-12 h-12 object-cover rounded-full mr-4"
                />
                <div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Engagement Score: {user.engagementScore}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
