import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { resetCars } from '../redux/features/garageSlice';
import { Link, useLocation } from 'react-router-dom';
import { Crown, DoorClosed } from 'lucide-react';

export default function NavButtons() {
  const raceStatus = useAppSelector((status) => status.garage.raceStatus);
  const location = useLocation();

  const dispatch = useAppDispatch();

  const handleToWinners = () => {
    dispatch(resetCars());
  };

  const isOnGarage = location.pathname === '/garage';

  const isRacing = raceStatus === 'racing';
  return (
    <>
      <Link
        to="/garage"
        className={`inline-block p-4 mr-5 mb-11 px-6 py-3 bg-blue-500 text-white 
          font-semibold rounded-lg hover:bg-blue-600 
            ${isRacing || isOnGarage ? 'pointer-events-none opacity-50' : ''}`}
      >
        TO GARAGE <DoorClosed className="inline" />
      </Link>
      <Link
        to="/winners"
        onClick={handleToWinners}
        className={`inline-block p-4 mb-11 px-6 py-3 text-white bg-yellow-600 hover:bg-yellow-700
             font-semibold rounded-lg
            ${isRacing || !isOnGarage ? 'pointer-events-none opacity-50' : ''}`}
      >
        TO WINNERS <Crown className="inline" />
      </Link>
    </>
  );
}
