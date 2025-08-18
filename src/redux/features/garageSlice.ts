import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Car } from '../../types/car';
import { getCars } from '../../api/cars';

interface GarageState {
  cars: Car[];
}

const initialState: GarageState = {
  cars: [],
};

export const fetchCars = createAsyncThunk<Car[]>(
  'garage/fetchCars',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCars();
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const addCar = createAsyncThunk<
  Car,
  { name: string; color: string },
  { rejectValue: string }
>('garage/addCar', async (newCar, { rejectWithValue }) => {
  try {
    const res = await fetch('http://localhost:3000/garage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCar),
    });

    if (!res.ok) return rejectWithValue('Failed to add car');

    return (await res.json()) as Car;
  } catch {
    return rejectWithValue('Network error');
  }
});

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
      });
  },
});

export const { setCars, removeCar } = garageSlice.actions;
export default garageSlice.reducer;
