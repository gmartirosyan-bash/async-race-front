import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  winners: [
    {
      id: 1,
      wins: 1,
      time: 10,
    }
  ]
}

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {},
})

export default winnersSlice.reducer
