import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import handleApiError from '../../utils/handleApiError';
import carsApi from '../../api/cars';
import engineApi from '../../api/race';
import type { Car, Start } from '../../types/car';
import type { RootState, AppDispatch } from '../store';

interface MovingCar {
  id: number;
  duration: number;
  broke: boolean;
}

interface GarageState {
  cars: Car[];
  error: string | null;
  loading: boolean;
  selected: Car | null;
  moving: MovingCar[];
  winner: number | null;
  page: number;
  carsCount: number;
}

const initialState: GarageState = {
  cars: [],
  error: null,
  loading: false,
  selected: null,
  moving: [],
  winner: null,
  page: 1,
  carsCount: 0,
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
  Car,
  { name: string; color: string },
  { rejectValue: unknown }
>('garage/addCar', async (newCar, { rejectWithValue }) => {
  try {
    const data = await carsApi.addCarApi(newCar);
    return data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const removeCar = createAsyncThunk<number, number, { rejectValue: unknown }>(
  'garage/removeCar',
  async (id, { rejectWithValue }) => {
    try {
      await carsApi.removeCarApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

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

export const startCar = createAsyncThunk<MovingCar, number, { rejectValue: unknown }>(
  'garage/startCar',
  async (id, { rejectWithValue }) => {
    try {
      const data = (await engineApi.raceApi(id, 'started')) as Start;
      const duration = data.distance / data.velocity;
      return { id, duration, broke: false };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const driveCar = createAsyncThunk<Start, number, { rejectValue: number }>(
  'garage/driveCar',
  async (id, { dispatch, rejectWithValue }) => {
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
  },
);

export const stopCar = createAsyncThunk<number | void, number>('garage/stopCar', async (id) => {
  try {
    await engineApi.raceApi(id, 'stopped');
    return id;
  } catch (err) {
    console.error('Failed to stop the car', err);
  }
});

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
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSelected(state, action: PayloadAction<Car | null>) {
      state.selected = action.payload;
    },
    nextPage: (state) => {
      if (state.page === Math.ceil(state.carsCount / 7)) {
        state.page = 1;
      } else {
        state.page += 1;
      }
    },
    prevPage: (state) => {
      if (state.page === 1) {
        state.page = Math.ceil(state.carsCount / 7);
      } else {
        state.page -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = false; //don't really need
        state.error = null;
      })
      .addCase(
        fetchCars.fulfilled,
        (state, action: PayloadAction<{ cars: Car[]; totalCount: number }>) => {
          state.cars = action.payload.cars;
          state.carsCount = action.payload.totalCount;
          state.loading = false;
        },
      )
      .addCase(fetchCars.rejected, (state, action) => {
        state.error = handleApiError(action.payload, 'Failed to fetch the cars. Please try again.');
        state.loading = false;
      })
      .addCase(addCar.fulfilled, (state, action: PayloadAction<Car>) => {
        state.cars.push(action.payload);
      })
      .addCase(addCar.rejected, (state, action) => {
        state.error = handleApiError(action.payload, 'Failed to add a car. Please try again.');
      })
      .addCase(removeCar.fulfilled, (state, action: PayloadAction<number>) => {
        state.cars = state.cars.filter((car) => car.id !== action.payload);
        state.moving = state.moving.filter((car) => car.id !== action.payload);
      })
      .addCase(removeCar.rejected, (state, action) => {
        state.error = handleApiError(action.payload, 'Failed to remove the car. Please try again.');
      })
      .addCase(updateCar.fulfilled, (state, action: PayloadAction<Car>) => {
        state.cars = state.cars.map((car) => (car.id === action.payload.id ? action.payload : car));
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.error = handleApiError(action.payload, 'Failed to update the car. Please try again.');
      })
      .addCase(startCar.fulfilled, (state, action: PayloadAction<MovingCar>) => {
        state.moving.push(action.payload);
      })
      .addCase(startCar.rejected, (state, action) => {
        state.error = handleApiError(action.payload, 'Failed to start the car. Please try again.');
      })
      .addCase(stopCar.fulfilled, (state, action) => {
        if (action) state.moving = state.moving.filter((car) => car.id !== action.payload);
      })
      .addCase(driveCar.rejected, (state, action) => {
        state.moving = state.moving.map((car) =>
          car.id === action.payload ? { ...car, broke: true } : car,
        );
      })
      .addCase(raceCars.fulfilled, (state, action) => {
        state.winner = action.payload;
      });

    // .addCase(driveCar.fulfilled, (state, action: PayloadAction<Start | void>) => {
    //   if (action.payload) state.time = action.payload.distance / action.payload.velocity;
    // });
  },
});

export const { setCars, setError, setSelected, nextPage, prevPage } = garageSlice.actions;
export default garageSlice.reducer;
