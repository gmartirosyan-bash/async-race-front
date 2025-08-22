import { addCar, raceCars, resetCars } from '../../redux/features/garageSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Play, Undo } from 'lucide-react';
import createRandomCars from '../../utils/carGenerator';

export default function RaceControls() {
  const movingCars = useAppSelector((status) => status.garage.pendingMoving);
  const raceStatus = useAppSelector((status) => status.garage.raceStatus);

  const carIsMoving = movingCars.length > 0;
  const finishedRacing = raceStatus === 'finished';
  const dispatch = useAppDispatch();

  const handleRace = () => {
    dispatch(raceCars());
  };

  const handleReset = () => {
    dispatch(resetCars());
  };

  const handleGenerate = () => {
    const newCars = createRandomCars();
    newCars.forEach((car) => dispatch(addCar(car)));
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
      <button
        onClick={handleReset}
        className={`px-2 mr-6 rounded-md border-2 text-lg border-red-500 
          ${!finishedRacing && !carIsMoving ? 'pointer-events-none opacity-50' : ''}`}
      >
        RESET <Undo className="inline text-red-600" size={18} />
      </button>
      <button
        onClick={handleGenerate}
        className="px-2 mr-6 rounded-md border-2 text-lg border-red-500"
      >
        GENERATE CARS
      </button>
    </div>
  );
}
