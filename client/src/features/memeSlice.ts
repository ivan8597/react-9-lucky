import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type MemeState = {
  imageUrl: string;
  text: string;
}

const initialState: MemeState = {
  imageUrl: '',
  text: '',
};

const memeSlice = createSlice({
  name: 'meme',
  initialState,
  reducers: {
    setImageUrl(state, action: PayloadAction<string>) {
      state.imageUrl = action.payload;
    },
    setText(state, action: PayloadAction<string>) {
      state.text = action.payload;
    },
  },
});

export const { setImageUrl, setText } = memeSlice.actions;
export default memeSlice.reducer;