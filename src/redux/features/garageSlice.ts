import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import carsApi from '../../api/cars';
import engineApi from '../../api/race';
import type { Car, Start, Winner } from '../../types/types';
import type { RootState, AppDispatch } from '../store';

interface MovingCar {
  id: number;
  time: number;
  broke: boolean;
}

export type RaceStatus = 'idle' | 'racing' | 'finished';

interface GarageState {
  cars: Car[];
  loading: boolean;
  selected: Car | null;
  moving: MovingCar[];
  pendingMoving: number[];
  winner: Winner | null;
  page: number;
  carsCount: number;
  raceStatus: RaceStatus;
}

const initialState: GarageState = {
  cars: [],
  loading: false,
  selected: null,
  moving: [],
  pendingMoving: [],
  winner: null,
  page: 1,
  carsCount: 0,
  raceStatus: 'idle',
};

export const fetchCars = createAsyncThunk<
  { cars: Car[]; totalCount: number },
  boolean,
  { state: RootState; dispatch: AppDispatch }
>('garage/fetchCars', async (firstRender, { getState, dispatch }) => {
  const page = getState().garage.page;
  try {
    if (firstRender) dispatch(setLoading(true));
    const data = await carsApi.getCarsApi(page);
    if (firstRender) dispatch(setLoading(false));
    return data;
  } catch (err) {
    console.error('Failed to fetch the cars:', err);
    throw err;
  }
});

export const addCar = createAsyncThunk<Car, { name: string; color: string }>(
  'garage/addCar',
  async (newCar) => {
    try {
      const data = await carsApi.addCarApi(newCar);
      return data;
    } catch (err) {
      console.error('Failed to add a cars:', err);
      throw err;
    }
  },
);

export const removeCar = createAsyncThunk<number, number, { dispatch: AppDispatch }>(
  'garage/removeCar',
  async (id, { dispatch }) => {
    try {
      dispatch(removePendingMoving(id));
      await carsApi.removeCarApi(id);
      dispatch(fetchCars(false));

      return id;
    } catch (err) {
      console.error('Failed to remove the cars:', err);
      throw err;
    }
  },
);

export const updateCar = createAsyncThunk<
  Car,
  { id: number; newCar: { name: string; color: string } }
>('garage/updateCar', async ({ id, newCar }) => {
  try {
    const data = await carsApi.updateCarApi(id, newCar);
    return data;
  } catch (err) {
    console.error('Failed to update the cars:', err);
    throw err;
  }
});

export const startCar = createAsyncThunk<MovingCar, number, { dispatch: AppDispatch }>(
  'garage/startCar',
  async (id, { dispatch }) => {
    try {
      dispatch(addPendingMoving(id));
      const data = (await engineApi.raceApi(id, 'started')) as Start;
      const time = data.distance / data.velocity;
      return { id, time, broke: false };
    } catch (err) {
      console.error('Failed to start the cars:', err);
      throw err;
    }
  },
);

export const driveCar = createAsyncThunk<
  Start,
  number,
  { dispatch: AppDispatch; rejectValue: number }
>('garage/driveCar', async (id, { dispatch, rejectWithValue }) => {
  try {
    await dispatch(startCar(id)).unwrap();

    const data = await engineApi.raceApi(id, 'drive');
    return data as Start;
  } catch (err: unknown) {
    if (typeof err === 'number' && err === 500) {
      return rejectWithValue(id);
    }
    console.error('Failed to remove the cars:', err);
    throw err;
  }
});

export const stopCar = createAsyncThunk<number, number>(
  'garage/stopCar',
  async (id, { dispatch }) => {
    try {
      dispatch(removePendingMoving(id));
      await engineApi.raceApi(id, 'stopped');
      return id;
    } catch (err) {
      console.error('Failed to stop the car:', err);
      throw err;
    }
  },
);

export const raceCars = createAsyncThunk<number, void, { state: RootState; dispatch: AppDispatch }>(
  'garage/raceCars',
  async (_, { getState, dispatch }) => {
    const cars = getState().garage.cars;

    const drivePromises = cars.map((car) =>
      dispatch(driveCar(car.id))
        .unwrap()
        .then(() => car.id),
    );

    try {
      const winnerId = await Promise.any(drivePromises);
      return winnerId;
    } catch (err) {
      console.error('Failed to stop the car:', err);
      throw err;
    }
  },
);

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setCars(state, action: PayloadAction<Car[]>) {
      state.cars = action.payload;
    },
    setSelected(state, action: PayloadAction<Car | null>) {
      state.selected = action.payload;
    },
    setLoading(state, aciton: PayloadAction<boolean>) {
      state.loading = aciton.payload;
    },
    resetCars(state) {
      state.moving = [];
      state.pendingMoving = [];
      state.selected = null;
      state.raceStatus = 'idle';
    },
    nextPage(state) {
      if (state.carsCount === 0) {
        state.page = 1;
      } else if (state.page === Math.ceil(state.carsCount / 7)) {
        state.page = 1;
      } else {
        state.page += 1;
      }
    },
    prevPage(state) {
      if (state.carsCount === 0) {
        state.page = 1;
      } else if (state.page === 1 || state.carsCount === 0) {
        state.page = Math.ceil(state.carsCount / 7);
      } else {
        state.page -= 1;
      }
    },
    addPendingMoving: (state, action: PayloadAction<number>) => {
      if (!state.pendingMoving.includes(action.payload)) {
        state.pendingMoving.push(action.payload);
      }
    },
    removePendingMoving: (state, action: PayloadAction<number>) => {
      state.pendingMoving = state.pendingMoving.filter((id) => id !== action.payload);
    },
    clearWinner: (state) => {
      state.winner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchCars.fulfilled,
        (state, action: PayloadAction<{ cars: Car[]; totalCount: number }>) => {
          state.cars = action.payload.cars;
          state.carsCount = action.payload.totalCount;
        },
      )
      .addCase(addCar.fulfilled, (state, action: PayloadAction<Car>) => {
        if (state.cars.length < 7) state.cars.push(action.payload);
        state.carsCount++;
      })
      .addCase(removeCar.fulfilled, (state) => {
        if (state.cars.length === 1 && state.page !== 1) state.page = state.page - 1;
        state.carsCount--;
      })
      .addCase(updateCar.fulfilled, (state, action: PayloadAction<Car>) => {
        state.cars = state.cars.map((car) => (car.id === action.payload.id ? action.payload : car));
      })
      .addCase(startCar.fulfilled, (state, action: PayloadAction<MovingCar>) => {
        if (state.pendingMoving.some((pm) => pm === action.payload.id))
          state.moving.push(action.payload);
      })
      .addCase(stopCar.fulfilled, (state, action: PayloadAction<number>) => {
        state.moving = state.moving.filter((car) => car.id !== action.payload);
      })
      .addCase(driveCar.rejected, (state, action) => {
        state.moving = state.moving.map((car) =>
          car.id === action.payload ? { ...car, broke: true } : car,
        );
      })
      .addCase(raceCars.pending, (state) => {
        state.raceStatus = 'racing';
        state.selected = null;
      })
      .addCase(raceCars.fulfilled, (state, action) => {
        const id = action.payload;
        const time = state.moving.find((m) => m.id === id)?.time;
        const name = state.cars.find((car) => car.id === id)?.name;
        if (name && time) state.winner = { id, name, time, wins: 0 };
        state.raceStatus = 'finished';
      })
      .addCase(raceCars.rejected, (state) => {
        state.raceStatus = 'finished';
      });
  },
});

export const {
  setCars,
  setSelected,
  nextPage,
  prevPage,
  addPendingMoving,
  removePendingMoving,
  setLoading,
  clearWinner,
  resetCars,
} = garageSlice.actions;
export default garageSlice.reducer;
