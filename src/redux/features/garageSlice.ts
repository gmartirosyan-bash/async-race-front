import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Car {
  id: number
  name: string
  color: string
}

interface GarageState {
  cars: Car[]
}

const initialState: GarageState = {
  cars: [
    { id: 1, name: 'Tesla', color: '#e6e6fa' },
    { id: 2, name: 'BMW', color: '#fede00' },
    { id: 3, name: 'Mersedes', color: '#6c779f' },
    { id: 4, name: 'Ford', color: '#ef3c40' },
  ],
}

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    addCar(state, action: PayloadAction<Car>){
      state.cars.push(action.payload)
    }
  }
})

export const { addCar } = garageSlice.actions
export default garageSlice.reducer