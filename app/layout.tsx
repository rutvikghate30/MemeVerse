"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "../store"
import "./globals.css"
import { Inter } from "next/font/google"
import Navigation from "./components/Navigation"
import Link from "next/link";
import { motion } from "framer-motion";
import { MemeProvider } from "./upload/MemeContext"
import { Github, Twitter, Instagram, Heart } from 'lucide-react';
import { FiTrendingUp, FiMenu, FiX } from "react-icons/fi";
import { FaHome, FaSearch, FaUpload, FaUser, FaTrophy } from "react-icons/fa";
import {metadata} from "./metadata"
import Head from "next/head"
const navItems = [
  { href: "/", label: "Home", icon: <FaHome /> },
  { href: "/explore", label: "Explore", icon: <FaSearch /> },
  { href: "/upload", label: "Upload", icon: <FaUpload /> },
  { href: "/profile", label: "Profile", icon: <FaUser /> },
  { href: "/leaderboard", label: "Leaderboard", icon: <FaTrophy /> },
];

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())
  }
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <html lang="en" className={darkMode ? "dark" : ""}>
      <Head>
      <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
      </Head>
      <body
        className={`${inter.className} bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}
      >
        <MemeProvider>

        <Provider store={store}>
        <header className="bg-white dark:bg-neutral-900 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-400 text-transparent bg-clip-text">
          MemeVerse
        </h1>
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex justify-center space-x-4">
            {navItems.map((item) => (
              <li key={item.href} className="flex items-center">
                <Link href={item.href}>
                  <motion.div
                    className="flex items-center  dark:text-yellow-500 dark:hover:text-orange-700 text-yellow-600 hover:text-orange-700 transition-colors duration-200"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-100"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
          {/* Hamburger menu for mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
          >
            {menuOpen ? (
              <FiX size={24} className="text-black dark:text-white" />
            ) : (
              <FiMenu size={24} className="text-black dark:text-white" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="md:hidden bg-white dark:bg-neutral-900">
          <ul className="flex flex-col space-y-2 p-4">
            {navItems.map((item) => (
              <li key={item.href} className="flex items-center">
                <Link href={item.href}>
                  <motion.div
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center text-black dark:text-white hover:text-yellow-500 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
          <Navigation />
          <main className="flex-grow container mx-auto">{children}</main>
          {/* <footer className="bg-white dark:bg-black shadow-md mt-8">
            <div className="container mx-auto px-4 py-4 text-center">© 2025 MemeVerse. All rights reserved.</div>
          </footer> */}
              <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-href-r from-yellow-600 href-blue-500 text-transparent bg-clip-text">
                MemeVerse
              </span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Your one-stop destination for exploring, creating, and sharing the internet's best memes.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                  Upload
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
            
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center">
            Made by MemeVerse © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
        </Provider>
        </MemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
