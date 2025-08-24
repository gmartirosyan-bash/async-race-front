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
  { sort?: 'wins' | 'time'; order?: 'ASC' | 'DESC' } | void,
  { state: RootState; dispatch: AppDispatch }
>('winners/fetchWinners', async (params, { getState, dispatch, rejectWithValue }) => {
  const page = getState().winners.page;
  const sort = params?.sort;
  const order = params?.order;

  try {
    const data = await winnersApi.getWinnersApi(page, sort, order);

    const winnersRaw: WinnerRaw[] = data.winners;

    const winners = await Promise.all(
      winnersRaw.map(async (wr) => {
        try {
          const car = await dispatch(fetchCar(wr.id)).unwrap();
          if (!car) return null;
          return { ...wr, name: car.name, color: car.color };
        } catch {
          return null;
        }
      }),
    );
    const filteredWinners = winners.filter(Boolean) as Winner[];

    return { winners: filteredWinners, winnersCount: data.totalCount };
  } catch (err: unknown) {
    if (err instanceof Response) {
      return rejectWithValue(`Failed to fetch winners (status ${err.status} ${err.statusText})`);
    }
    return rejectWithValue('Failed to fetch winners (unknown error)');
  }
});

export const declareWinner = createAsyncThunk<
  void,
  { id: number; time: number; name: string },
  { dispatch: AppDispatch }
>('winners/declareWinner', async ({ id, time, name }, { dispatch, rejectWithValue }) => {
  dispatch(setWinner({ id, time, name }));

  try {
    const existing = await winnersApi.getWinnerApi(id);
    const wins = existing.wins + 1;
    const bestTime = Math.min(existing.time, time);

    await dispatch(updateWinner({ id, time: bestTime, wins })).unwrap();
  } catch (err: unknown) {
    if (err instanceof Response && err.status === 404) {
      const wins = 1;
      const bestTime = time;

      await dispatch(addWinner({ id, time: bestTime, wins })).unwrap();
    } else if (err instanceof Response) {
      return rejectWithValue(`Failed to get winner (status ${err.status} ${err.statusText})`);
    } else {
      return rejectWithValue('Failed to get winner (unknown error)');
    }
  }
});

export const removeWinner = createAsyncThunk<void, number>(
  'winners/removeWinner',
  async (id, { rejectWithValue }) => {
    try {
      await winnersApi.removeWinnerApi(id);
    } catch (err: unknown) {
      if (err instanceof Response) {
        if (err.status === 404) return;
        return rejectWithValue(`Failed to remove winner (status ${err.status} ${err.statusText})`);
      }
      return rejectWithValue('Failed to remove winner (unknown error)');
    }
  },
);

export const updateWinner = createAsyncThunk<void, WinnerRaw>(
  'winners/updateWinner',
  async ({ id, time, wins }, { rejectWithValue }) => {
    try {
      await winnersApi.updateWinnerApi(id, { time, wins });
    } catch (err: unknown) {
      if (err instanceof Response) {
        return rejectWithValue(`Failed to update winner (status ${err.status} ${err.statusText})`);
      }
      return rejectWithValue('Failed to update winner (unknown error)');
    }
  },
);

export const addWinner = createAsyncThunk<void, WinnerRaw>(
  'winners/addWinner',
  async ({ id, time, wins }, { rejectWithValue }) => {
    try {
      await winnersApi.addWinnerApi({ id, time, wins });
    } catch (err: unknown) {
      if (err instanceof Response) {
        return rejectWithValue(`Failed to add winner (status ${err.status} ${err.statusText})`);
      }
      return rejectWithValue('Failed to add winner (unknown error)');
    }
  },
);

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
    clearWinners(state) {
      state.winners = [];
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
      } else if (state.page === 1) {
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
      .addCase(fetchWinners.rejected, (_, action) => {
        console.error(action.payload ?? action.error.message);
      })
      .addCase(declareWinner.rejected, (_, action) => {
        console.error(action.payload ?? action.error.message);
      })
      .addCase(updateWinner.rejected, (_, action) => {
        console.error(action.payload ?? action.error.message);
      })
      .addCase(removeWinner.rejected, (_, action) => {
        console.error(action.payload ?? action.error.message);
      });
  },
});

export const { setWinner, clearWinner, clearWinners, nextWinnersPage, prevWinnersPage } =
  winnerSlice.actions;
export default winnerSlice.reducer;
