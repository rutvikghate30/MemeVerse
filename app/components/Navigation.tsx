"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaHome, FaSearch, FaUpload, FaUser, FaTrophy } from "react-icons/fa";

const navItems = [
  { href: "/", label: "Home", icon: <FaHome /> },
  { href: "/explore", label: "Explore", icon: <FaSearch /> },
  { href: "/upload", label: "Upload", icon: <FaUpload /> },
  { href: "/profile", label: "Profile", icon: <FaUser /> },
  { href: "/leaderboard", label: "Leaderboard", icon: <FaTrophy /> },
];

export default function Navigation() {
  return (
    // <nav className="bg-gray-800 text-white p-4">
    //   <ul className="flex justify-center space-x-4">
    //     {navItems.map((item) => (
    //       <li key={item.href} className="flex items-center">
    //         <Link href={item.href}>
    //           <motion.div
    //             className="flex items-center hover:text-blue-300 transition-colors duration-200"
    //             whileHover={{ scale: 1.1 }}
    //             whileTap={{ scale: 0.95 }}
    //           >
    //             <span className="mr-2">{item.icon}</span>
    //             <span>{item.label}</span>
    //           </motion.div>
    //         </Link>
    //       </li>
    //     ))}
    //   </ul>
    // </nav>
    <></>
  );
}
