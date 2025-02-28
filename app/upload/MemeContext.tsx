"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

// Type definitions
export interface Meme {
  id: string;
  title: string;
  url: string;
  width: number;
  height: number;
  box_count?: number;
  captions?: number;
  category?: string;
  likes?: number;
  comments?: Comment[];
  createdAt?: string;
  author?: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

// State interface
interface MemeState {
  memes: Meme[];
  likedMemes: string[];
  userMemes: Meme[];
  loading: boolean;
  error: string | null;
}

// Action types
type MemeAction =
  | { type: "SET_MEMES"; payload: Meme[] }
  | { type: "ADD_MEME"; payload: Meme }
  | { type: "TOGGLE_LIKE"; payload: string }
  | { type: "ADD_COMMENT"; payload: { memeId: string; comment: Comment } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_LIKED_MEMES"; payload: string[] }
  | { type: "SET_USER_MEMES"; payload: Meme[] };

interface MemeContextType {
  state: MemeState;
  dispatch: React.Dispatch<MemeAction>;
  likeMeme: (memeId: string) => void;
  addComment: (memeId: string, text: string) => void;
  uploadMeme: (meme: Omit<Meme, "id" | "createdAt" | "likes" | "comments">) => void;
  isMemeliked: (memeId: string) => boolean;
}

// Initial state
const initialState: MemeState = {
  memes: [],
  likedMemes: [],
  userMemes: [],
  loading: false,
  error: null,
};

// Reducer
const memeReducer = (state: MemeState, action: MemeAction): MemeState => {
  switch (action.type) {
    case "SET_MEMES":
      return { ...state, memes: action.payload, loading: false };
    case "SET_LIKED_MEMES":
      return { ...state, likedMemes: action.payload };
    case "SET_USER_MEMES":
      return { ...state, userMemes: action.payload };
    case "ADD_MEME":
      return {
        ...state,
        memes: [action.payload, ...state.memes],
        userMemes: [action.payload, ...state.userMemes],
      };
    case "TOGGLE_LIKE":
      const memeId = action.payload;
      const isLiked = state.likedMemes.includes(memeId);
      // Update likes in both memes and userMemes
      const updatedMemes = state.memes.map((meme) =>
        meme.id === memeId
          ? { ...meme, likes: (meme.likes || 0) + (isLiked ? -1 : 1) }
          : meme
      );
      const updatedUserMemes = state.userMemes.map((meme) =>
        meme.id === memeId
          ? { ...meme, likes: (meme.likes || 0) + (isLiked ? -1 : 1) }
          : meme
      );
      return {
        ...state,
        memes: updatedMemes,
        userMemes: updatedUserMemes,
        likedMemes: isLiked
          ? state.likedMemes.filter((id) => id !== memeId)
          : [...state.likedMemes, memeId],
      };
    case "ADD_COMMENT":
      return {
        ...state,
        memes: state.memes.map((meme) =>
          meme.id === action.payload.memeId
            ? { ...meme, comments: [...(meme.comments || []), action.payload.comment] }
            : meme
        ),
        userMemes: state.userMemes.map((meme) =>
          meme.id === action.payload.memeId
            ? { ...meme, comments: [...(meme.comments || []), action.payload.comment] }
            : meme
        ),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const MemeContext = createContext<MemeContextType | undefined>(undefined);

export const MemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [state, dispatch] = useReducer(memeReducer, initialState);

  // Load liked memes and user memes from localStorage on initial render
  useEffect(() => {
    const savedLikedMemes = localStorage.getItem("likedMemes");
    if (savedLikedMemes) {
      const likedMemes = JSON.parse(savedLikedMemes);
      dispatch({ type: "SET_LIKED_MEMES", payload: likedMemes });
    }
    const savedUserMemes = localStorage.getItem("userMemes");
    if (savedUserMemes) {
      const userMemes = JSON.parse(savedUserMemes);
      dispatch({ type: "SET_USER_MEMES", payload: userMemes });
    }
  }, []);

  // Persist liked memes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("likedMemes", JSON.stringify(state.likedMemes));
  }, [state.likedMemes]);

  // Persist user memes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userMemes", JSON.stringify(state.userMemes));
  }, [state.userMemes]);

  const likeMeme = (memeId: string) => {
    dispatch({ type: "TOGGLE_LIKE", payload: memeId });
  };

  const addComment = (memeId: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      author: "Anonymous User", // In a real app, use the logged-in user info
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_COMMENT", payload: { memeId, comment: newComment } });
  };

  const uploadMeme = (meme: Omit<Meme, "id" | "createdAt" | "likes" | "comments">) => {
    const newMeme: Meme = {
      ...meme,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      author: "Anonymous User", // In a real app, use the logged-in user info
    };
    dispatch({ type: "ADD_MEME", payload: newMeme });
  };

  const isMemeliked = (memeId: string) => {
    return state.likedMemes.includes(memeId);
  };

  return (
    <MemeContext.Provider
      value={{ state, dispatch, likeMeme, addComment, uploadMeme, isMemeliked }}
    >
      {children}
    </MemeContext.Provider>
  );
};

export const useMeme = (): MemeContextType => {
  const context = useContext(MemeContext);
  if (context === undefined) {
    throw new Error("useMeme must be used within a MemeProvider");
  }
  return context;
};
