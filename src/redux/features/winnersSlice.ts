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
  try {
    let wins: number;
    let bestTime: number;
    try {
      const existing = await winnersApi.getWinnerApi(id);
      wins = existing.wins + 1;
      bestTime = Math.min(existing.time, time);

      await winnersApi.updateWinnerApi(id, { time: bestTime, wins });
    } catch (err) {
      if (err instanceof Error) {
        wins = 1;
        bestTime = time;
        await winnersApi.addWinnerApi({ id, time: bestTime, wins });
      } else {
        console.error('Failed to get or update the winner:', err);
        throw err;
      }
    }

    return { id, name, color, time: bestTime, wins };
  } catch (err) {
    console.error('Failed to declare the winner:', err);
    throw err;
  }
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
