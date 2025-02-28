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
    transition={{ duration: 0.6 }} className="container mx-auto px-4 py-8 white bg-white dark:bg-gray-900">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-orange-400 text-transparent bg-clip-text text-center">
        User Profile
      </h1>

      {/* Layout: Two columns on md screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Edit Profile Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block mb-1">Name:</label>
              <input
                type="text"
                value={profileInfo.name}
                onChange={(e) =>
                  setProfileInfo({ ...profileInfo, name: e.target.value })
                }
                className="w-full p-2 border rounded text-black"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block mb-1">Bio:</label>
              <textarea
                value={profileInfo.bio}
                onChange={(e) =>
                  setProfileInfo({ ...profileInfo, bio: e.target.value })
                }
                className="w-full p-2 border rounded text-black"
                rows={3}
                placeholder="Your bio"
              />
            </div>
            <div>
              <label className="block mb-1">Profile Picture:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="w-full"
              />
              {profileInfo.profilePicture && (
                <img
                  src={profileInfo.profilePicture}
                  alt="Profile Preview"
                  className="mt-2 w-32 h-32 rounded-full object-cover"
                />
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Update Profile
            </motion.button>
          </form>
        </div>

        {/* Meme Listings Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Memes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userMemes.length > 0 ? (
              userMemes.map((meme) => (
                <Link key={meme.id} href={`/meme/${meme.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                  >
                    <img
                      src={meme.url || "/placeholder.svg"}
                      alt={meme.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg">{meme.title}</h3>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <p>No memes uploaded yet.</p>
            )}
          </div>

          <h2 className="text-2xl font-bold my-4">Liked Memes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {likedMemes.length > 0 ? (
              likedMemes.map((memeId) => {
                const likedMeme = memes.find((m) => m.id === memeId);
                if (!likedMeme) return null;
                return (
                  <Link key={likedMeme.id} href={`/meme/${likedMeme.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                    >
                      <img
                        src={likedMeme.url || "/placeholder.svg"}
                        alt={likedMeme.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{likedMeme.title}</h3>
                      </div>
                    </motion.div>
                  </Link>
                );
              })
            ) : (
              <p>No liked memes yet.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
