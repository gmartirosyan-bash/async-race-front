import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addCar } from "../redux/features/garageSlice"
import type { RootState } from '../redux/store'
import type { Car } from "../redux/features/garageSlice"

export default function Garage() {
  const cars = useSelector((state: RootState) => state.garage.cars)

  const [name, setName] = useState<string>('')
  const [color, setColor] = useState<string>('#000000')

  const dispatch = useDispatch()

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault()
    if(!name.trim() || !color.trim()) return
    const newCar: Car = { id: Date.now(), name, color}
    dispatch(addCar(newCar))
    setName('')
    setColor('#000000')
  }

  return (
    <>
      <div>
        <h1>Navigation</h1>
        <button className="block">Garage</button>
        <button>Winners</button>
      </div>
      <div>
        <h1>CarControls</h1>
        <button>Race</button>
        <button>Reset</button>
        <form onSubmit={handleAddCar}>
          <label htmlFor="car-name" className="mr-2">
            Car Name
          </label>
          <input
            className="mr-4"
            id="car-name"
            placeholder="Enter car name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <label htmlFor="car-color" className="mr-2">
            Car Color
          </label>
          <input
            className="w-7 mr-2"
            id="car-color"
            placeholder="Enter car color"
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
          />
          <button
            className="px-2 py-1"
            type="submit"
          >
            Add Car
          </button>
        </form>

      </div>
      <div>
        <h1>car list</h1>
        <ul>
          {cars.map(car => <li key={car.id} style={{ color: car.color }}>{car.name}</li>)}
        </ul>
      </div>
    </>
  )
}