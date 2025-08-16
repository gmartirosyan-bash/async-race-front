import { useSelector } from "react-redux"
import type { RootState } from '../redux/store'

export default function Garage() {
  const cars = useSelector((state: RootState) => state.garage.cars)
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
        <input type="text" />
        <button>Create</button>
        <input type="text" />
        <button>Update</button>
      </div>
      <div>
        <h1>car list</h1>
        {cars.map(car => <li key={car.id} style={{ color: car.color }}>{car.name}</li>)}
      </div>

    </>
  )
}