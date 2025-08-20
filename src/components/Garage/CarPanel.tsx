import { driveCar, removeCar, setSelected, stopCar } from '../../redux/features/garageSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { useState } from 'react';
import type { Car } from '../../types/car';

interface CarPanelProps {
  car: Car;
}

export default function CarPanel({ car }: CarPanelProps) {
  const selected = useAppSelector((state) => state.garage.selected);

  const [moving, setMoving] = useState<boolean>(false);

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

  const handleDriveCar = (id: number) => {
    dispatch(driveCar(id));
    setMoving(true);
  };

  const handleStopCar = (id: number) => {
    dispatch(stopCar(id));
  };

  return (
    <div className={`flex items-center gap-4 ${moving ? 'pointer-events-none opacity-50' : ''}`}>
      <div className="flex flex-col gap-3 max-w-25">
        <button
          onClick={() => handleSelectCar(car)}
          className="px-3 font-semibold rounded-2xl bg-yellow-400 text-black"
        >
          {selected && selected.id === car.id ? 'UNSET' : 'SELECT'}
        </button>
        <button
          onClick={() => handleRemoveCar(car.id)}
          className="px-3 font-semibold rounded-2xl bg-pink-700 text-black"
        >
          REMOVE
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleDriveCar(car.id)}
          className="px-3 font-semibold rounded-2xl bg-green-500 text-black"
        >
          START
        </button>
        <button
          onClick={() => handleStopCar(car.id)}
          className="px-3 font-semibold rounded-2xl bg-red-700 text-black"
        >
          STOP
        </button>
      </div>
    </div>
  );
}
