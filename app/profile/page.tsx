"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMeme } from "../upload/MemeContext";
import Link from "next/link";

interface ProfileInfo {
  name: string;
  bio: string;
  profilePicture: string; // URL string
}

const ProfilePage: React.FC = () => {
  // Get meme data from context
  const { state } = useMeme();
  const { userMemes, likedMemes, memes } = state;

  // Local state for profile info
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: "",
    bio: "",
    profilePicture: "",
  });

  // Load profile info from localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setProfileInfo(JSON.parse(storedProfile));
    }
  }, []);

  // Persist profile info whenever it changes
  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profileInfo));
  }, [profileInfo]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // For this demo, we simply persist the updated profile info.
    // In a real app, you might dispatch an API call.
    alert("Profile updated!");
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      // For simulation, we use URL.createObjectURL to get a preview URL.
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setProfileInfo({ ...profileInfo, profilePicture: url });
    }
  };

  console.log(userMemes)

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      {/* Enhanced Title with animation */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text text-center"
      >
        User Profile
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Enhanced Edit Profile Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Profile</h2>
          
          {/* Profile Picture Section */}
          <div className="mb-6 flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-40 h-40 mb-4"
            >
              <div className="w-40 h-40 rounded-full border-4 border-orange-500 overflow-hidden">
                <img
                  src={profileInfo.profilePicture || "/default-avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full cursor-pointer shadow-lg hover:bg-orange-600 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </motion.div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={profileInfo.name}
                onChange={(e) => setProfileInfo({ ...profileInfo, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-black"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={profileInfo.bio}
                onChange={(e) => setProfileInfo({ ...profileInfo, bio: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-black"
                rows={4}
                placeholder="Tell us about yourself"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              Save Changes
            </motion.button>
          </form>
        </motion.div>

        {/* Enhanced Meme Listings Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Memes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {userMemes.length > 0 ? (
                userMemes.map((meme) => (
                  <Link key={meme.id} href={`/meme/${meme.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
                    >
                      <img
                        src={meme.url || "/placeholder.svg"}
                        alt={meme.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{meme.title}</h3>
                      </div>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No memes uploaded yet.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Liked Memes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {likedMemes.length > 0 ? (
                likedMemes.map((memeId) => {
                  const likedMeme = memes.find((m) => m.id === memeId);
                  if (!likedMeme) return null;
                  return (
                    <Link key={likedMeme.id} href={`/meme/${likedMeme.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.03, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
                      >
                        <img
                          src={likedMeme.url || "/placeholder.svg"}
                          alt={likedMeme.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-gray-800 dark:text-white">{likedMeme.title}</h3>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No liked memes yet.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
