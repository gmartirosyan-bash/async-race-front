import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import carsApi from '../../api/cars';
import engineApi from '../../api/race';
import type { Car, Start } from '../../types/car';
import type { RootState, AppDispatch } from '../store';

interface MovingCar {
  id: number;
  duration: number;
  broke: boolean;
}

export type RaceStatus = 'idle' | 'racing' | 'finished';

interface GarageState {
  cars: Car[];
  loading: boolean;
  selected: Car | null;
  moving: MovingCar[];
  pendingMoving: number[];
  winner: number | null;
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
  void,
  { state: RootState; rejectValue: unknown }
>('garage/fetchCars', async (_, { getState, rejectWithValue }) => {
  const page = getState().garage.page;
  try {
    const data = await carsApi.getCarsApi(page);
    return data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const addCar = createAsyncThunk<
  void,
  { name: string; color: string },
  { dispatch: AppDispatch; rejectValue: unknown }
>('garage/addCar', async (newCar, { dispatch, rejectWithValue }) => {
  try {
    await carsApi.addCarApi(newCar);
    dispatch(fetchCars());
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const removeCar = createAsyncThunk<
  number,
  number,
  { dispatch: AppDispatch; rejectValue: unknown }
>('garage/removeCar', async (id, { dispatch, rejectWithValue }) => {
  try {
    dispatch(removePendingMoving(id));
    await carsApi.removeCarApi(id);
    dispatch(fetchCars());

    return id;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const updateCar = createAsyncThunk<
  Car,
  { id: number; newCar: { name: string; color: string } },
  { rejectValue: unknown }
>('garage/updateCar', async ({ id, newCar }, { rejectWithValue }) => {
  try {
    const data = await carsApi.updateCarApi(id, newCar);
    return data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const startCar = createAsyncThunk<
  MovingCar,
  number,
  { dispatch: AppDispatch; rejectValue: unknown }
>('garage/startCar', async (id, { dispatch, rejectWithValue }) => {
  try {
    dispatch(addPendingMoving(id));
    const data = (await engineApi.raceApi(id, 'started')) as Start;
    const duration = data.distance / data.velocity;
    return { id, duration, broke: false };
  } catch (err) {
    return rejectWithValue(err);
  }
});

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
    } catch {
      throw new Error('Failed to stop the car');
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
    } catch {
      throw new Error('All cars failed');
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
    nextPage: (state) => {
      if (state.page === Math.floor(state.carsCount / 7) + 1) {
        state.page = 1;
      } else {
        state.page += 1;
      }
    },
    prevPage: (state) => {
      if (state.page === 1) {
        state.page = Math.floor(state.carsCount / 7) + 1;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = false; //don't really need
      })
      .addCase(
        fetchCars.fulfilled,
        (state, action: PayloadAction<{ cars: Car[]; totalCount: number }>) => {
          state.cars = action.payload.cars;
          state.carsCount = action.payload.totalCount;
          state.loading = false;
        },
      )
      .addCase(fetchCars.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addCar.fulfilled, (state) => {
        state.carsCount++;
      })
      .addCase(removeCar.fulfilled, (state, action: PayloadAction<number>) => {
        state.moving = state.moving.filter((car) => car.id !== action.payload);
        state.carsCount--;
      })
      .addCase(updateCar.fulfilled, (state, action: PayloadAction<Car>) => {
        state.cars = state.cars.map((car) => (car.id === action.payload.id ? action.payload : car));
      })
      .addCase(startCar.fulfilled, (state, action: PayloadAction<MovingCar>) => {
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
      })
      .addCase(raceCars.fulfilled, (state, action) => {
        state.winner = action.payload;
        state.raceStatus = 'finished';
      })
      .addCase(raceCars.rejected, (state) => {
        state.raceStatus = 'finished';
      });
  },
});

export const { setCars, setSelected, nextPage, prevPage, addPendingMoving, removePendingMoving } =
  garageSlice.actions;
export default garageSlice.reducer;
