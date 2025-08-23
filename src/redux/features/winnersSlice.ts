import { createSlice } from '@reduxjs/toolkit';

interface Winner {
  id: number;
  img: number;
  color: string;
  name: string;
  wins: number;
  time: number;
}

interface WinnersState {
  winners: Winner[];
}

const initialState: WinnersState = {
  winners: [],
};

// export const fetchWinners = createAsyncThunk<>(
//   'winners/fetchWinners',
//   async () => {

//   }
// )

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {},
});

export default winnersSlice.reducer;
