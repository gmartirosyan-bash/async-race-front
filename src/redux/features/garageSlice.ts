import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Car {
  id: number;
  name: string;
  color: string;
}

interface GarageState {
  cars: Car[];
}

const initialState: GarageState = {
  cars: [],
};

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setCars(state, action: PayloadAction<Car[]>) {
      state.cars = action.payload;
    },
    addCar(state, action: PayloadAction<Car>) {
      state.cars.push(action.payload);
    },
    removeCar(state, action: PayloadAction<number>) {
      state.cars = state.cars.filter((car) => car.id !== action.payload);
    },
  },
});

export const { setCars, addCar, removeCar } = garageSlice.actions;
export default garageSlice.reducer;
