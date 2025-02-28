import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchTrendingMemes = createAsyncThunk("memes/fetchTrending", async () => {
  const response = await axios.get("https://api.imgflip.com/get_memes")
  return response.data.data.memes.slice(0, 10) // Get top 10 memes
})

export const fetchMemes = createAsyncThunk(
  "memes/fetchMemes",
  async ({ category, page, sortBy }: { category: string; page: number; sortBy: string }) => {
    // In a real app, you'd use these parameters to fetch from your API
    const response = await axios.get("https://api.imgflip.com/get_memes")
    return response.data.data.memes
  },
)

export const searchMemes = createAsyncThunk("memes/searchMemes", async (searchTerm: string) => {
  // In a real app, you'd use the searchTerm to fetch from your API
  const response = await axios.get("https://api.imgflip.com/get_memes")
  return response.data.data.memes.filter((meme: any) => meme.name.toLowerCase().includes(searchTerm.toLowerCase()))
})

export const fetchMemeDetails = createAsyncThunk("memes/fetchMemeDetails", async (id: string) => {
  // In a real app, you'd fetch the meme details from your API
  const response = await axios.get("https://api.imgflip.com/get_memes")
  return response.data.data.memes.find((meme: any) => meme.id === id)
})

export const likeMeme = createAsyncThunk("memes/likeMeme", async (id: string) => {
  // In a real app, you'd send a like request to your API
  return id
})

export const addComment = createAsyncThunk<{ id: string; comment: string }, { id: string; comment: string }>(
  "memes/addComment",
  async ({ id, comment }: { id: string; comment: string }) => {
    // In a real app, you'd send the comment to your API
    return { id, comment }
  },
)

interface Meme {
  id: string;
  name: string;
  url: string;
  likes: number;
  comments: string[];
}

const memesSlice = createSlice({
  name: "memes",
  initialState: {
    trendingMemes: [] as Meme[],
    memes: [] as Meme[],
    memeDetails: null as Meme | null,
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingMemes.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchTrendingMemes.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.trendingMemes = action.payload
      })
      .addCase(fetchTrendingMemes.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? null
      })
      .addCase(fetchMemes.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMemes.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.memes = action.payload
      })
      .addCase(fetchMemes.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? null
      })
      .addCase(searchMemes.pending, (state) => {
        state.status = "loading"
      })
      .addCase(searchMemes.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.memes = action.payload
      })
      .addCase(searchMemes.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? null
      })
      .addCase(fetchMemeDetails.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMemeDetails.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.memeDetails = action.payload
      })
      .addCase(fetchMemeDetails.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message ?? null
      })
      .addCase(likeMeme.fulfilled, (state, action) => {
        if (state.memeDetails && state.memeDetails.id === action.payload) {
          state.memeDetails.likes += 1
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.memeDetails && state.memeDetails.id === action.payload.id) {
          state.memeDetails.comments.push(action.payload.comment)
        }
      })
  },
})

export default memesSlice.reducer

