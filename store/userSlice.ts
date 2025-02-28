import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchUserMemes = createAsyncThunk("user/fetchUserMemes", async () => {
  // In a real app, you'd fetch the user's memes from your API
  const response = await axios.get("https://api.imgflip.com/get_memes")
  return response.data.data.memes.slice(0, 5) // Simulate user's memes
})

export const updateUserProfile = createAsyncThunk("user/updateUserProfile", async (formData: FormData) => {
  // In a real app, you'd send the form data to your API
  return {
    name: formData.get("name") as string,
    bio: formData.get("bio") as string,
    profilePicture: formData.get("profilePicture") as string,
  }
})

const userSlice = createSlice({
  name: "user",
  initialState: {
    userMemes: [],
    likedMemes: [],
    profile: {
      name: "Rutvik Ghate",
      bio: "Meme enthusiast",
      profilePicture: "/placeholder-user.jpg",
    },
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserMemes.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchUserMemes.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.userMemes = action.payload
        state.likedMemes = action.payload.slice(0, 3) // Simulate liked memes
      })
      .addCase(fetchUserMemes.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? "Unknown error"
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload }
      })
  },
})

export default userSlice.reducer

