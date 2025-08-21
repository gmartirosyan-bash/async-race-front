import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { resetCars } from '../redux/features/garageSlice';

import { Link } from 'react-router-dom';

export default function NavButtons() {
  const raceStatus = useAppSelector((status) => status.garage.raceStatus);

  const dispatch = useAppDispatch();

  const handleToWinners = () => {
    dispatch(resetCars());
  };

  const isRacing = raceStatus === 'racing';
  return (
    <>
      <Link
        to="/garage"
        className={`inline-block bg-transparent p-4 mr-5 mb-11 text-red-500
            border-1 ring-3 ring-red-700 border-red-700 outline-2 outline-red-400 rounded-2xl
            ${isRacing ? 'pointer-events-none opacity-50' : ''}`}
      >
        TO GARAGE
      </Link>
      <Link
        to="/winners"
        onClick={handleToWinners}
        className={`inline-block bg-transparent p-4 text-blue-500
            border-2 border-blue-400 outline-2 outline-blue-700 rounded-2xl
            ${isRacing ? 'pointer-events-none opacity-50' : ''}`}
      >
        TO WINNERS
      </Link>
    </>
  );
}
