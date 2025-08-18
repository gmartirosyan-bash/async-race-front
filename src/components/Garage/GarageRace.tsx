import { removeCar, setSelected } from '../../redux/features/garageSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import carSvgs from '../../assets/carSvgs';
import type { Car } from '../../types/car';

export default function GarageRace() {
  const cars = useAppSelector((state) => state.garage.cars);
  const selected = useAppSelector((state) => state.garage.selected);

  const dispatch = useAppDispatch();

  const handleRemoveCar = (id: number) => {
    dispatch(removeCar(id));
  };

  const handleSelectCar = (car: Car) => {
    if (selected?.id === car.id) {
      dispatch(setSelected(null));
    } else {
      dispatch(setSelected(car));
    }
  };

  return (
    <div>
      {cars.map((car, i) => {
        const Car = carSvgs[i % 9];
        return (
          <div
            key={car.id}
            className={`flex items-center border-b-white border-b-4 ${!selected || selected?.id === car.id ? 'opacity-100' : 'opacity-50'}`}
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-3 max-w-25">
                <button
                  onClick={() => handleSelectCar(car)}
                  className="px-3 font-semibold rounded-2xl bg-yellow-400 text-black"
                >
                  {selected && selected.id === car.id ? 'UNDO' : 'SELECT'}
                </button>
                <button
                  onClick={() => handleRemoveCar(car.id)}
                  className="px-3 font-semibold rounded-2xl bg-pink-700 text-black"
                >
                  REMOVE
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <button className="px-3 font-semibold rounded-2xl bg-green-700 text-black">
                  START
                </button>
                <button className="px-3 font-semibold rounded-2xl bg-red-700 text-black">
                  STOP
                </button>
              </div>
            </div>
            <Car className="w-40 h-20" fill={car.color} />
            <p className="ml-2">{car.name}</p>
          </div>
        );
      })}
    </div>
  );
}
