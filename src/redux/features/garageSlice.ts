import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import handleApiError from '../../utils/handleApiError';
import carsApi from '../../api/cars';
import type { Car } from '../../types/car';

interface GarageState {
  cars: Car[];
}

const initialState: GarageState = {
  cars: [],
};

export const fetchCars = createAsyncThunk<Car[], void>(
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

export const addCar = createAsyncThunk<Car, { name: string; color: string }>(
  'garage/addCar',
  async (newCar, { rejectWithValue }) => {
    try {
      const data = await carsApi.addCarApi(newCar);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const removeCar = createAsyncThunk<number, number>(
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.fulfilled, (state, action: PayloadAction<Car[]>) => {
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (_, action) => {
        handleApiError(action.payload, 'Failed to fetch the cars. Please try again.');
      })
      .addCase(addCar.fulfilled, (status, action: PayloadAction<Car>) => {
        status.cars.push(action.payload);
      })
      .addCase(addCar.rejected, (_, action) => {
        handleApiError(action.payload, 'Failed to add a cars. Please try again.');
      })
      .addCase(removeCar.fulfilled, (status, action: PayloadAction<number>) => {
        status.cars = status.cars.filter((car) => car.id !== action.payload);
      })
      .addCase(removeCar.rejected, (_, action) => {
        handleApiError(action.payload, 'Failed to remove the car. Please try again.');
      });
  },
});

export const { setCars } = garageSlice.actions;
export default garageSlice.reducer;
