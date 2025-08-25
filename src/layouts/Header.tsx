import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { resetCars } from '../redux/features/garageSlice';
import { Link, useLocation } from 'react-router-dom';
import { Crown, DoorClosed } from 'lucide-react';
import { clearWinners } from '../redux/features/winnersSlice';

export default function Header() {
  const raceStatus = useAppSelector((status) => status.garage.raceStatus);
  const location = useLocation();

  const dispatch = useAppDispatch();

  const handleToWinners = () => {
    dispatch(resetCars());
  };

  const handleToGarage = () => {
    dispatch(clearWinners());
  };

  const isOnGarage = location.pathname === '/garage';
  const isRacing = raceStatus === 'racing';

  return (
    <header className="bg-red-800/40 shadow-lg shadow-red-500">
      <div className="m-auto max-w-350 flex items-center justify-around">
        <img src="/logo4.png" alt="logo" className="sm:w-40 w-20" />

        <div className="flex sm:flex-row my-2 items-center">
          <Link
            to="/garage"
            onClick={handleToGarage}
            className={`p-4 px-6 mr-4 bg-blue-500 text-white 
              font-semibold rounded-lg hover:bg-blue-600
              ${isOnGarage ? 'pointer-events-none opacity-50' : ''}`}
          >
            TO GARAGE <DoorClosed className="inline" />
          </Link>
          <Link
            to="/winners"
            onClick={handleToWinners}
            className={`p-4 px-6 text-white bg-yellow-600 
              hover:bg-yellow-700 active:bg-amber-500 active:text-black
              font-semibold rounded-lg
              ${isRacing || !isOnGarage ? 'pointer-events-none opacity-50' : ''}`}
          >
            TO WINNERS <Crown className="inline" />
          </Link>
        </div>
      </div>
    </header>
  );
}
