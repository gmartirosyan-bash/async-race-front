import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import winnersApi from '../../api/winners';
import type { Winner } from '../../types/types';

interface WinnerState {
  currentWinner: Winner | null;
  winners: Winner[];
}

const initialState: WinnerState = {
  currentWinner: null,
  winners: [],
};

export const declareWinner = createAsyncThunk<
  Winner,
  { id: number; time: number; name: string; color: string }
>('winners/declareWinner', async ({ id, time, name, color }) => {
  let wins = 0;
  try {
    const data = await winnersApi.getWinnerApi(id);
    wins = data.wins;
    time = Math.min(data.time, time);
  } catch {
    wins = 0;
  }
  console.log('hey');
  const winner: Winner = {
    id,
    name,
    color,
    time,
    wins: wins + 1,
  };

  winnersApi.addWinnerApi({ id, time, wins });

  return winner;
});

const winnerSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    clearWinner(state) {
      state.currentWinner = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(declareWinner.fulfilled, (state, action) => {
      state.currentWinner = action.payload;
      // const existingIndex = state.winners.findIndex((w) => w.id === action.payload.id);
      // if (existingIndex >= 0) {
      //   state.winners[existingIndex] = action.payload;
      // } else {
      //   state.winners.push(action.payload);
      // }
    });
  },
});

export const { clearWinner } = winnerSlice.actions;
export default winnerSlice.reducer;
