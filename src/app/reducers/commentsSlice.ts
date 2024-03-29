import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CommentType } from "../../types/commentType"
import { formatComments, getSinglePost } from "../../utility"


export interface CommentsState {
  fetchStatus: 'idle' | 'fetching',
  lastId: string,
  comments: CommentType[],
}

export const initialState: CommentsState = {
  fetchStatus: 'idle',
  lastId: '',
  comments: [],
}

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ url, postId }: {url: string, postId: string}, _api) => {
    try {
      const data = await getSinglePost(url);

      return {
        comments: formatComments(data),
        postId,
      }
    } catch(e) {
    }
  }
)

export const commentsReducer = createSlice({
  name: 'comments',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.fetchStatus = 'fetching';
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<{ comments: CommentType[], postId: string} | undefined>) => {
        if (!action.payload) return;
        const { comments, postId } = action.payload;

        state.lastId = postId;
        state.comments = comments;
        state.fetchStatus = 'idle';
      })
  }
})

export default commentsReducer.reducer;