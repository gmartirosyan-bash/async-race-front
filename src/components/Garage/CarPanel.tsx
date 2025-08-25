import { driveCar, removeCar, setSelected, stopCar } from '../../redux/features/garageSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { PencilOff, Pencil, Trash2 } from 'lucide-react';
import type { Car } from '../../types/types';

interface CarPanelProps {
  car: Car;
}

export default function CarPanel({ car }: CarPanelProps) {
  const selected = useAppSelector((state) => state.garage.selected);
  const raceStatus = useAppSelector((s) => s.garage.raceStatus);
  const movingCars = useAppSelector((s) => s.garage.pendingMoving);

  const dispatch = useAppDispatch();

  const isRacing = raceStatus === 'racing';
  const isMoving = movingCars.some((id) => id === car.id);

  const startEnabled = !isRacing && !isMoving;
  const stopEnabled = !isRacing && isMoving;

  const handleRemoveCar = (id: number) => {
    dispatch(removeCar(id));
    if (selected?.id === car.id) {
      dispatch(setSelected(null));
    }
  };

  const handleSelectCar = (car: Car) => {
    if (selected?.id === car.id) {
      dispatch(setSelected(null));
    } else {
      dispatch(setSelected(car));
    }
  };

  const handleDriveCar = (id: number) => {
    dispatch(driveCar(id));
    if (selected?.id === car.id) {
      dispatch(setSelected(null));
    }
  };

  const handleStopCar = (id: number) => {
    dispatch(stopCar(id));
    if (selected?.id === car.id) {
      dispatch(setSelected(null));
    }
  };

  return (
    <div className={`relative flex items-center gap-4 my-5`}>
      <div className="flex flex-col gap-3 sm:ml-6 ml-3">
        <button
          onClick={() => handleSelectCar(car)}
          className={`font-semibold text-yellow-400 border-1 border-yellow-400 rounded p-1
          ${isRacing ? 'pointer-events-none opacity-50' : ''}`}
        >
          {selected && selected.id === car.id ? <PencilOff size={15} /> : <Pencil size={15} />}
        </button>
        <button
          onClick={() => handleRemoveCar(car.id)}
          className={`font-semibold text-red-600 border-1 borde-red-600 rounded p-1
          ${isRacing ? 'pointer-events-none opacity-50' : ''}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
      <div className="flex flex-col gap-3 mr-4">
        <button
          onClick={() => handleDriveCar(car.id)}
          className={`active:scale-90 transform transition-transform duration-20 
            px-4 text-sm font-semibold rounded-2xl bg-green-400 text-black 
            border-2 border-gray-600
            ${!startEnabled ? 'pointer-events-none opacity-50' : ''}`}
        >
          START
        </button>
        <button
          onClick={() => handleStopCar(car.id)}
          className={`active:scale-90 transform transition-transform duration-20
            px-4 text-sm font-semibold rounded-2xl bg-red-800 text-white
            border-2 border-gray-700
            ${!stopEnabled ? 'pointer-events-none opacity-50' : ''}`}
        >
          STOP
        </button>
        <p className="absolute font-bitcount sm:font-extralight font-light text-amber-200 sm:left-85 left-40 top-3 sm:text-5xl text-2xl -z-10 sm:min-w-200">
          {car.name}
        </p>
      </div>
    </div>
  );
}
