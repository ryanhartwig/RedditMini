import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { formatUrl } from "../../utility";
import { base } from "../../utility/data";

import type { Subreddit } from "../../types";
import { reviver } from "../../utility/serializeHelper";

interface SubredditsState {
  in_storage: InStorage
  searchInput: string,
  searchStatus: string,
  searchResults: Subreddit[],
  toggleQueue: Subreddit[],
  open: boolean,
  srOpen: boolean,
  inSearch: boolean,
}

interface InStorage {
  subs: Subreddit[],
  blocked: Subreddit[],
}

const initialState: SubredditsState = {
  in_storage: {
    subs: [],
    blocked: [],
  },
  searchInput: '',
  searchStatus: 'idle',
  searchResults: [],
  toggleQueue: [],
  open: false,
  srOpen: false,
  inSearch: false,
}

let savedState: InStorage | undefined;
try {
  savedState = JSON.parse(localStorage.getItem('subreddits/in_storage') as string, reviver) as InStorage;
} catch(e) {
  // No saved state
}

export const getSubreddits = createAsyncThunk(
  'subreddits/getSubreddits',
  async (query: string) => {
    const response = await fetch(formatUrl(`${base}search/?q=${query}&type=sr&limit=10`));
    const data = await response.json();

    return data;
  }
);

export const subredditsReducer = createSlice({
  name: 'subreddits',
  initialState: savedState ? { ...initialState, in_storage: savedState } : initialState,
  reducers: {
    toggleSubreddit: (state, action: PayloadAction<Subreddit>) => {
      let index = state.in_storage.subs.findIndex((s) => s.name === action.payload.name);
      if (index === -1) {
        state.in_storage.subs.push(action.payload);
        state.in_storage.subs = state.in_storage.subs.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      } else {
        state.in_storage.subs.splice(index, 1)
      }
    },
    toggleBlocked: (state, action: PayloadAction<Subreddit>) => {
      let index = state.in_storage.blocked.findIndex(s => s.name === action.payload.name);

      if (index === -1) {
        state.in_storage.blocked.push(action.payload);
        let followedIndex = state.in_storage.subs.findIndex(s => s.name === action.payload.name);
        if (followedIndex !== -1) {
          state.in_storage.subs.splice(followedIndex, 1);
        }
      } else {
        state.in_storage.blocked.splice(index, 1);
      }
    },
    setLoading: (state, action: PayloadAction<string>) => {
      state.searchStatus = action.payload;
    },
    toggleResult: (state, action: PayloadAction<Subreddit>) => {
      let index = state.toggleQueue.findIndex((sr) => sr.name === action.payload.name);
      if (index === -1) {
        state.toggleQueue.push(action.payload);
      } else {
        state.toggleQueue.splice(index, 1);
      }
    },
    clearToggleQueue: (state) => {
      state.toggleQueue = [];
    },
    toggleOpen: (state, action: PayloadAction<boolean | undefined>) => {
      state.open = action.payload ?? !state.open;
    },
    toggleSrOpen: (state, action: PayloadAction<boolean | undefined>) => {
      state.srOpen = action.payload ?? !state.srOpen;
    },
    toggleInSearch: (state, action: PayloadAction<boolean | undefined>) => {
      state.inSearch = action.payload ?? !state.inSearch;
    },
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
    onClearSubreddits: (state) => {
      let srOpen = state.srOpen;
      let open = state.open;

      return {...initialState, open, srOpen}
    }
  }, 
  extraReducers: (builder) => {
    builder
      .addCase(getSubreddits.fulfilled, (state, action) => {
        state.searchStatus = 'idle';
        state.searchResults = action.payload.data.children.map((sub: any): Subreddit => {
          return {
            name: sub.data.display_name,
            icon_url: sub.data.community_icon,
            is_valid: sub.data.subreddit_type !== 'private',
          }
        }).filter((s: Subreddit) => s.is_valid);
      })
      .addCase(getSubreddits.rejected, (state) => {
        state.searchStatus = 'error';
      });
  }
});

export const { toggleSubreddit, toggleBlocked, setLoading, toggleResult, clearToggleQueue, toggleOpen, toggleSrOpen, toggleInSearch, setSearchInput, onClearSubreddits } = subredditsReducer.actions;

export default subredditsReducer.reducer;