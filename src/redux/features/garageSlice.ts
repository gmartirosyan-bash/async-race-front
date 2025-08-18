import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Car } from '../../types/car';
import carsApi from '../../api/cars';

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

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setCars(state, action: PayloadAction<Car[]>) {
      state.cars = action.payload;
    },
    removeCar(state, action: PayloadAction<number>) {
      state.cars = state.cars.filter((car) => car.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.fulfilled, (state, action: PayloadAction<Car[]>) => {
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (_, action) => {
        console.error(action.payload);
      })
      .addCase(addCar.fulfilled, (status, action: PayloadAction<Car>) => {
        status.cars.push(action.payload);
      })
      .addCase(addCar.rejected, (_, action) => {
        console.error(action.payload);
      });
  },
});

export const { setCars, removeCar } = garageSlice.actions;
export default garageSlice.reducer;
