import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface articleState {
  articleId: number;
}

const initialState: articleState = {
  articleId: 0,
};

export const articleSlice = createSlice({
  name: "articleId",
  initialState,
  reducers: {
    setArticleState: (state, action: PayloadAction<articleState>) => {
      state.articleId = action.payload.articleId;
    },
  },
});

export const { setArticleState } = articleSlice.actions;
export const articleReducer = articleSlice.reducer;
