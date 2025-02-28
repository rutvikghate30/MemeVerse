"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Upload, Image, Sparkles, X, Check, Wand2, Type, Layout, Palette } from "lucide-react";
import { useMeme } from "./MemeContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import axios from "axios";

const IMGBB_API_URL = "https://api.imgbb.com/1";
// const IMGBB_API_KEY = "92df20183b6f17601296d99082ebe255";

export const uploadImage = async (imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axios.post(
      `${IMGBB_API_URL}/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      formData
    );

    if (response.data.success) {
      return response.data.data.url;
    }

    throw new Error("Failed to upload image");
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const generateMemeCaption = async (memeTitle: string): Promise<string> => {
  const captions = [
    "When you finally fix that bug after 8 hours",
    "Me explaining to my mom why I need a new graphics card",
    "When the code works on the first try",
    "That moment when you realize you forgot a semicolon",
    "My brain during an exam vs. my brain watching Netflix",
    "When someone asks if I'm sure this will work",
    "How I see myself vs. how others see me coding",
    "When the client says 'just one small change'",
    "Me trying to explain my code at 5pm on Friday",
    "When the documentation is outdated but you figure it out anyway",
  ];
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * captions.length);
      resolve(captions[randomIndex]);
    }, 1000);
  });
};

const createMeme = async (imageUrl: string, topText: string, bottomText: string): Promise<string> => {
  try {
    const response = await axios.post('https://api.memegen.link/images/custom', {
      background: imageUrl,
      text_top: topText,
      text_bottom: bottomText,
    });
    return response.data.url;
  } catch (error) {
    console.error("Error creating meme:", error);
    throw error;
  }
};

const UploadPage: React.FC = () => {
  const router = useRouter();
  const { uploadMeme } = useMeme();

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [isMemeMode, setIsMemeMode] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      // Auto-generate title from filename
      const fileName = selectedFile.name.split(".")[0];
      const formattedTitle = fileName
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      setTitle(formattedTitle);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleGenerateCaption = async () => {
    if (!title) {
      setError("Please add a title first");
      return;
    }
    try {
      setGenerating(true);
      const generatedCaption = await generateMemeCaption(title);
      setCaption(generatedCaption);
    } catch (err) {
      setError("Failed to generate caption. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      setError("Please select an image and add a title");
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // Upload image first
      const imageUrl = await uploadImage(file);

      // If in meme mode, create meme using the uploaded image
      const finalImageUrl = isMemeMode ? 
        await createMeme(imageUrl, topText, bottomText) : 
        imageUrl;

      // Create meme object
      const newMeme = {
        id: Date.now().toString(), // Generate unique ID
        title,
        url: finalImageUrl,
        width: 500,
        height: 500,
        captions: caption ? 1 : 0,
        category: "user-uploaded",
      };

      // Call context function to add new meme
      uploadMeme(newMeme);

      // Store in localStorage
      const existingMemes = JSON.parse(localStorage.getItem('userMemes') || '[]');
      localStorage.setItem('userMemes', JSON.stringify([...existingMemes, newMeme]));

      setSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (err) {
      setError("Failed to upload meme. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setTitle("");
    setCaption("");
    setError(null);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-600 to-orange-400 text-transparent bg-clip-text">
            Upload Your Meme
          </h1>

          {success ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-100 dark:bg-green-900 p-6 rounded-lg text-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-white" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                Upload Successful!
              </h2>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Your meme has been uploaded successfully.
              </p>
              <p className="text-green-700 dark:text-green-300">
                Redirecting to your profile...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meme Image
                </label>
                {!previewUrl ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                        : "border-gray-300 dark:border-gray-700 hover:border-yellow-500 dark:hover:border-yellow-500"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                      <Image size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        {isDragActive
                          ? "Drop your image here..."
                          : "Drag & drop your image here, or click to select"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Supports: JPG, PNG, GIF (max 5MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-contain bg-gray-100 dark:bg-gray-800"
                    />
                    <button
                      type="button"
                      onClick={handleReset}
                      className="absolute top-2 right-2 p-1 bg-gray-900/70 text-white rounded-full hover:bg-gray-900"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meme Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a catchy title"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Caption (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateCaption}
                    disabled={generating}
                    className="text-xs flex items-center text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
                  >
                    {generating ? (
                      <>
                        <LoadingSpinner size={12} />
                        <span className="ml-1">Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} className="mr-1" />
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a funny caption"
                  rows={3}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Add Toggle for Meme Creation Mode */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 mb-4"
              >
                <button
                  type="button"
                  onClick={() => setIsMemeMode(!isMemeMode)}
                  className={`flex items-center px-4 py-2 rounded-md transition-all ${
                    isMemeMode 
                      ? "bg-yellow-600 text-white" 
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Wand2 size={16} className="mr-2" />
                  Meme Creator Mode
                </button>
              </motion.div>

              <AnimatePresence>
                {isMemeMode && previewUrl && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Type size={16} className="mr-2" />
                        Top Text
                      </label>
                      <input
                        type="text"
                        value={topText}
                        onChange={(e) => setTopText(e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500"
                        placeholder="Enter top text"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Layout size={16} className="mr-2" />
                        Bottom Text
                      </label>
                      <input
                        type="text"
                        value={bottomText}
                        onChange={(e) => setBottomText(e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-500"
                        placeholder="Enter bottom text"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              {error && <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>}

              {/* Upload Progress */}
              {loading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-medium transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size={16} color="text-white" />
                      <span className="ml-2">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="mr-2" />
                      Upload Meme
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;
