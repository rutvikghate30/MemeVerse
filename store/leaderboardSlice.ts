import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchLeaderboard = createAsyncThunk("leaderboard/fetchLeaderboard", async () => {
  // In a real app, you'd fetch the leaderboard data from your API
  const response = await axios.get("https://api.imgflip.com/get_memes")
  const memes = response.data.data.memes.slice(0, 10)
  const users = memes.map((meme: any, index: number) => ({
    id: `user${index}`,
    name: `User ${index + 1}`,
    profilePicture: "/placeholder-user.jpg",
    engagementScore: Math.floor(Math.random() * 1000),
  }))
  return { memes, users }
})

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
    topMemes: [],
    topUsers: [],
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.topMemes = action.payload.memes
        state.topUsers = action.payload.users
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? null
      })
  },
})

export default leaderboardSlice.reducer

