import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import winnersApi from '../../api/winners';
import type { Winner, WinnerRaw } from '../../types/types';
import type { AppDispatch, RootState } from '../store';
import { fetchCar } from './garageSlice';

interface WinnerState {
  winners: Winner[];
  currentWinner: Winner | null;
  page: number;
  winnersCount: number;
}

const initialState: WinnerState = {
  winners: [],
  currentWinner: null,
  page: 1,
  winnersCount: 0,
};

export const fetchWinners = createAsyncThunk<
  { winners: Winner[]; winnersCount: number },
  void,
  { state: RootState; dispatch: AppDispatch }
>('winners/fetchWinners', async (_, { getState, dispatch }) => {
  const page = getState().winners.page;

  try {
    const data = await winnersApi.getWinnersApi(page);
    const winnersRaw: WinnerRaw[] = data.winners;

    const winners: Winner[] = await Promise.all(
      winnersRaw.map(async (wr) => {
        const car = await dispatch(fetchCar(wr.id)).unwrap();
        return { ...wr, name: car.name, color: car.color };
      }),
    );

    return { winners, winnersCount: data.totalCount };
  } catch (err) {
    console.error('Failed to fetch the winners: ', err);
    throw err;
  }
});

export const declareWinner = createAsyncThunk<Winner, Omit<Winner, 'wins'>>(
  'winners/declareWinner',
  async ({ id, time, name, color }) => {
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
  },
);

const winnerSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    clearWinner(state) {
      state.currentWinner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(declareWinner.fulfilled, (state, action) => {
        state.currentWinner = action.payload;
      })
      .addCase(
        fetchWinners.fulfilled,
        (state, action: PayloadAction<{ winners: Winner[]; winnersCount: number }>) => {
          state.winners = action.payload.winners;
          state.winnersCount = action.payload.winnersCount;
        },
      );
  },
});

export const { clearWinner } = winnerSlice.actions;
export default winnerSlice.reducer;
