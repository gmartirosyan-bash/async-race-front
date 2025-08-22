import { useAppSelector } from '../../redux/hooks';
import CarElement from './CarElement';
import CarPanel from './CarPanel';

import type { Car } from '../../types/types';

interface GarageProps {
  car: Car;
}

export default function GarageCar({ car }: GarageProps) {
  const selected = useAppSelector((state) => state.garage.selected);

  return (
    <div
      className={`mt-5 py-2 flex items-center border-y-4 ${!selected || selected?.id === car.id ? 'opacity-100' : 'opacity-50'}`}
    >
      <CarPanel car={car} />
      <CarElement car={car} />
    </div>
  );
}
