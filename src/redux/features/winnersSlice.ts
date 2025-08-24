import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import winnersApi from '../../api/winners';
import type { Winner, WinnerRaw, CurrentWinner } from '../../types/types';
import type { AppDispatch, RootState } from '../store';
import { fetchCar } from './garageSlice';

interface WinnerState {
  winners: Winner[];
  currentWinner: CurrentWinner | null;
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

    // const winners: Winner[] = await Promise.all(
    //   winnersRaw.map(async (wr) => {
    //     const car = await dispatch(fetchCar(wr.id)).unwrap();
    //     return { ...wr, name: car.name, color: car.color };
    //   }),
    // );
    const winners: Winner[] = (
      await Promise.allSettled(
        winnersRaw.map(async (wr) => {
          const car = await dispatch(fetchCar(wr.id)).unwrap();
          return { ...wr, name: car.name, color: car.color };
        }),
      )
    )
      .filter((res): res is PromiseFulfilledResult<Winner> => res.status === 'fulfilled')
      .map((res) => res.value);

    return { winners, winnersCount: data.totalCount };
  } catch (err) {
    console.error('Failed to fetch the winners: ', err);
    throw err;
  }
});

export const declareWinner = createAsyncThunk<
  void,
  { id: number; time: number; name: string },
  { dispatch: AppDispatch }
>('winners/declareWinner', async ({ id, time, name }, { dispatch }) => {
  dispatch(setWinner({ id, time, name }));

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
  } catch (err) {
    console.error('Failed to declare the winner:', err);
    throw err;
  }
});

export const removeWinner = createAsyncThunk<void, number>('garage/removeWinner', async (id) => {
  try {
    await winnersApi.removeWinnerApi(id);
  } catch (err) {
    console.error('Failed to remove the car:', err);
    throw err;
  }
});

const winnerSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setWinner(state, action: PayloadAction<CurrentWinner>) {
      state.currentWinner = action.payload;
    },
    clearWinner(state) {
      state.currentWinner = null;
    },
    nextWinnersPage(state) {
      if (state.winnersCount === 0) {
        state.page = 1;
      } else if (state.page === Math.ceil(state.winnersCount / 10)) {
        state.page = 1;
      } else {
        state.page += 1;
      }
    },
    prevWinnersPage(state) {
      if (state.winnersCount === 0) {
        state.page = 1;
      } else if (state.page === 1 || state.winnersCount === 0) {
        state.page = Math.ceil(state.winnersCount / 10);
      } else {
        state.page -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchWinners.fulfilled,
        (state, action: PayloadAction<{ winners: Winner[]; winnersCount: number }>) => {
          state.winners = action.payload.winners;
          state.winnersCount = action.payload.winnersCount;
        },
      )
      .addCase(removeWinner.fulfilled, () => {
        // state.winnersCount--;
      });
  },
});

export const { setWinner, clearWinner, nextWinnersPage, prevWinnersPage } = winnerSlice.actions;
export default winnerSlice.reducer;
