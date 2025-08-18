import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import handleApiError from '../../utils/handleApiError';
import carsApi from '../../api/cars';
import type { Car } from '../../types/car';

interface GarageState {
  cars: Car[];
  error: string | null;
  loading: boolean;
  selected: Car | null;
}

const initialState: GarageState = {
  cars: [],
  error: null,
  loading: false,
  selected: null,
};

export const fetchCars = createAsyncThunk<Car[], void, { rejectValue: unknown }>(
  'garage/fetchCars',
  async (_, { rejectWithValue }) => {
    try {
      const data = await carsApi.getCarsApi();
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action: PayloadAction<Car[]>) => {
        state.cars = action.payload;
        state.loading = false;
      })
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
      })
      .addCase(removeCar.rejected, (state, action) => {
        state.error = handleApiError(action.payload, 'Failed to remove the car. Please try again.');
      });
  },
});

export const { setCars, setError, setSelected } = garageSlice.actions;
export default garageSlice.reducer;
