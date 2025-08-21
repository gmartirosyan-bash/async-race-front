import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { resetCars } from '../redux/features/garageSlice';
import { Link } from 'react-router-dom';
import { Crown, DoorClosed } from 'lucide-react';
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
        className={`inline-block p-4 mr-5 mb-11 px-6 py-3 bg-blue-500 text-white 
          font-semibold rounded-lg hover:bg-blue-600 focus:outline-none 
          focus:ring-2 focus:ring-blue-400 
            ${isRacing ? 'pointer-events-none opacity-50' : ''}`}
      >
        TO GARAGE <DoorClosed className="inline" />
      </Link>
      <Link
        to="/winners"
        onClick={handleToWinners}
        className={`inline-block p-4 mr-5 mb-11 px-6 py-3 text-white bg-yellow-600 hover:bg-yellow-700
             font-semibold rounded-lg
            ${isRacing ? 'pointer-events-none opacity-50' : ''}`}
      >
        TO WINNERS <Crown className="inline" />
      </Link>
    </>
  );
}
