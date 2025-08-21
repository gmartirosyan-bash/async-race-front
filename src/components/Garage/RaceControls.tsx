import { raceCars } from '../../redux/features/garageSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Play, Undo } from 'lucide-react';

export default function RaceControls() {
  const movingCars = useAppSelector((s) => s.garage.pendingMoving);

  const carIsMoving = movingCars.length > 0;
  const dispatch = useAppDispatch();

  const handleRace = () => {
    dispatch(raceCars());
  };

  return (
    <div className={`mt-10 flex`}>
      <button
        onClick={handleRace}
        className={`px-2 mr-6 rounded-md border-2 text-lg border-red-500
      ${carIsMoving ? 'pointer-events-none opacity-50' : ''}`}
      >
        RACE <Play className="inline text-red-600" size={18} />
      </button>
      <button className="px-2 mr-6 rounded-md border-2 text-lg border-red-500">
        RESET <Undo className="inline text-red-600" size={18} />
      </button>
      <button className="px-2 mr-6 rounded-md border-2 text-lg border-red-500">
        GENERATE CARS
      </button>
    </div>
  );
}
