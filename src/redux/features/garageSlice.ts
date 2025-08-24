import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import carsApi from '../../api/cars';
import engineApi from '../../api/race';
import type { Car, MovingCar, Start } from '../../types/types';
import type { RootState, AppDispatch } from '../store';
import { declareWinner, removeWinner } from './winnersSlice';

export type RaceStatus = 'idle' | 'racing' | 'finished';

interface GarageState {
  cars: Car[];
  selected: Car | null;
  moving: MovingCar[];
  pendingMoving: number[];
  page: number;
  carsCount: number;
  raceStatus: RaceStatus;
}

const initialState: GarageState = {
  cars: [],
  selected: null,
  moving: [],
  pendingMoving: [],
  page: 1,
  carsCount: 0,
  raceStatus: 'idle',
};

export const fetchCars = createAsyncThunk<
  { cars: Car[]; totalCount: number },
  void,
  { state: RootState }
>('garage/fetchCars', async (_, { getState }) => {
  const page = getState().garage.page;
  try {
    const data = await carsApi.getCarsApi(page);
    return data;
  } catch (err) {
    console.error('Failed to fetch the cars:', err);
    throw err;
  }
});

export const fetchCar = createAsyncThunk<Car | undefined, number, { dispatch: AppDispatch }>(
  'garage/fetchCar',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const data = await carsApi.getCarApi(id);
      return data;
    } catch (err: unknown) {
      if (err instanceof Response) {
        if (err.status === 404) {
          dispatch(removeWinner(id));
          return undefined;
        }
        return rejectWithValue(`Failed to remove winner (status ${err.status} ${err.statusText})`);
      }
      return rejectWithValue(`Failed to remove winner (unknown error)`);
    }
  },
);

export const addCar = createAsyncThunk<
  Car,
  { name: string; color: string },
  { rejectValue: string }
>('garage/addCar', async (newCar, { rejectWithValue }) => {
  try {
    const data = await carsApi.addCarApi(newCar);
    return data;
  } catch (err: unknown) {
    if (err instanceof Response)
      return rejectWithValue(`Failed to add a car (status ${err.status} ${err.statusText})`);
    return rejectWithValue('Failed to add a car (unknown error)');
  }
});

export const removeCar = createAsyncThunk<number, number, { dispatch: AppDispatch }>(
  'garage/removeCar',
  async (id, { dispatch }) => {
    try {
      dispatch(removePendingMoving(id));
      dispatch(removeMoving(id));
      await carsApi.removeCarApi(id);
      dispatch(fetchCars());
      dispatch(removeWinner(id));
      return id;
    } catch (err) {
      console.error('Failed to remove the car:', err);
      throw err;
    }
  },
);

export const updateCar = createAsyncThunk<
  Car,
  { id: number; newCar: { name: string; color: string } }
>('garage/updateCar', async ({ id, newCar }, { rejectWithValue }) => {
  try {
    const data = await carsApi.updateCarApi(id, newCar);
    return data;
  } catch (err: unknown) {
    if (err instanceof Response)
      return rejectWithValue(`Failed to update the car (status ${err.status} ${err.statusText})`);
    return rejectWithValue('Failed to update the car (unknown error)');
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
      console.error('Failed to start the car:', err);
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
    if (err instanceof Response && err.status === 500) {
      return rejectWithValue(id);
    }
    console.error('Failed to drive the car :', err);
    throw err;
  }
});

export const stopCar = createAsyncThunk<number, number>(
  'garage/stopCar',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(removePendingMoving(id));
      await engineApi.raceApi(id, 'stopped');
      return id;
    } catch (err: unknown) {
      if (err instanceof Response)
        return rejectWithValue(`Failed to stop the car (status ${err.status} ${err.statusText})`);
      return rejectWithValue('Failed to stop the car (unknown error)');
    }
  },
);

export const resetCars = createAsyncThunk<void, void, { state: RootState; dispatch: AppDispatch }>(
  'garage/resetCars',
  async (_, { getState, dispatch }) => {
    const moving: MovingCar[] = getState().garage.moving;
    dispatch(fastResetCars());
    try {
      await dispatch(fetchCars());
      await Promise.all(
        moving.map(async (m) => {
          await dispatch(stopCar(m.id));
        }),
      );
    } catch (err) {
      console.error('Failed to reset cars:', err);
      throw err;
    }
  },
);

export const raceCars = createAsyncThunk<Car, void, { state: RootState; dispatch: AppDispatch }>(
  'garage/raceCars',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const cars = getState().garage.cars;

    const drivePromises = cars.map(async (car) => {
      await dispatch(driveCar(car.id)).unwrap();
      return car;
    });

    try {
      const winner = await Promise.any(drivePromises);
      const state = getState().garage;
      const id = winner.id;
      const time = state.moving.find((m) => m.id === id)?.time;
      const name = state.cars.find((car) => car.id === id)?.name;
      if (name && time) dispatch(declareWinner({ id, time, name }));
      return winner;
    } catch {
      return rejectWithValue('No car reached the end');
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
    nextCarsPage(state) {
      if (state.carsCount === 0) {
        state.page = 1;
      } else if (state.page === Math.ceil(state.carsCount / 7)) {
        state.page = 1;
      } else {
        state.page += 1;
      }
    },
    prevCarsPage(state) {
      if (state.carsCount === 0) {
        state.page = 1;
      } else if (state.page === 1) {
        state.page = Math.ceil(state.carsCount / 7);
      } else {
        state.page -= 1;
      }
    },
    fastResetCars(state) {
      state.moving = [];
      state.selected = null;
    },
    addPendingMoving(state, action: PayloadAction<number>) {
      if (!state.pendingMoving.includes(action.payload)) {
        state.pendingMoving.push(action.payload);
      }
    },
    removePendingMoving(state, action: PayloadAction<number>) {
      state.pendingMoving = state.pendingMoving.filter((id) => id !== action.payload);
    },
    removeMoving(state, action: PayloadAction<number>) {
      state.moving = state.moving.filter((m) => m.id !== action.payload);
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
      .addCase(fetchCar.rejected, (_, action) => {
        console.error(action.payload ?? action.error.message);
      })
      .addCase(addCar.rejected, (_, action) => {
        console.error(action.payload ?? action.error.message);
      })
      .addCase(addCar.fulfilled, (state, action: PayloadAction<Car>) => {
        if (state.cars.length < 7) state.cars.push(action.payload);
        state.carsCount++;
      })
      .addCase(removeCar.fulfilled, (state) => {
        if (state.cars.length === 1 && state.page !== 1) state.page = state.page - 1;
        state.carsCount--;
      })
      .addCase(updateCar.rejected, (_, action) => {
        console.error(action.payload ?? action.error.message);
      })
      .addCase(updateCar.fulfilled, (state, action: PayloadAction<Car>) => {
        state.cars = state.cars.map((car) => (car.id === action.payload.id ? action.payload : car));
      })
      .addCase(startCar.fulfilled, (state, action: PayloadAction<MovingCar>) => {
        if (state.pendingMoving.some((pm) => pm === action.payload.id))
          state.moving.push(action.payload);
      })
      .addCase(stopCar.rejected, (_, action) => {
        console.error(action.payload ?? action.error.message);
      })
      .addCase(stopCar.fulfilled, (state, action: PayloadAction<number>) => {
        state.moving = state.moving.filter((car) => car.id !== action.payload);
      })
      .addCase(driveCar.rejected, (state, action) => {
        state.moving = state.moving.map((car) =>
          car.id === action.payload ? { ...car, broke: true } : car,
        );
      })
      .addCase(resetCars.fulfilled, (state) => {
        state.pendingMoving = [];
        state.raceStatus = 'idle';
      })
      .addCase(raceCars.pending, (state) => {
        state.raceStatus = 'racing';
        state.selected = null;
      })
      .addCase(raceCars.fulfilled, (state) => {
        state.raceStatus = 'finished';
      })
      .addCase(raceCars.rejected, (state, action) => {
        console.error(action.payload ?? action.error.message);
        state.raceStatus = 'finished';
      });
  },
});

export const {
  setCars,
  setSelected,
  nextCarsPage,
  prevCarsPage,
  addPendingMoving,
  removePendingMoving,
  removeMoving,
  fastResetCars,
} = garageSlice.actions;
export default garageSlice.reducer;
