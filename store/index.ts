import { configureStore } from "@reduxjs/toolkit"
import memesReducer from "./memesSlice"
import userReducer from "./userSlice"
import leaderboardReducer from "./leaderboardSlice"

export const store = configureStore({
  reducer: {
    memes: memesReducer,
    user: userReducer,
    leaderboard: leaderboardReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

