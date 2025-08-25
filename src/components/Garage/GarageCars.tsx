import { useAppSelector } from '../../redux/hooks';
import GarageCar from './GarageCar';

export default function GarageCars() {
  const cars = useAppSelector((state) => state.garage.cars);

  return (
    <div>
      {cars.map((car) => {
        return <GarageCar key={car.id} car={car} />;
      })}
    </div>
  );
}
