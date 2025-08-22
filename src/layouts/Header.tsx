import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { resetCars } from '../redux/features/garageSlice';
import { Link, useLocation } from 'react-router-dom';
import { Crown, DoorClosed } from 'lucide-react';

export default function Header() {
  const raceStatus = useAppSelector((status) => status.garage.raceStatus);
  const location = useLocation();

  const dispatch = useAppDispatch();

  const handleToWinners = () => {
    dispatch(resetCars());
  };

  const isOnGarage = location.pathname === '/garage';
  const isRacing = raceStatus === 'racing';

  return (
    <div>
      <header className="flex justify-around gap-100 items-center bg-red-800/20 m-auto">
        <img src="/logo4.png" alt="" className="w-40" />

        <div>
          <Link
            to="/garage"
            className={`p-4 px-6 mr-4 bg-blue-500 text-white 
            font-semibold rounded-lg hover:bg-blue-600 
            ${isRacing || isOnGarage ? 'pointer-events-none opacity-50' : ''}`}
          >
            TO GARAGE <DoorClosed className="inline" />
          </Link>
          <Link
            to="/winners"
            onClick={handleToWinners}
            className={`p-4 px-6 text-white bg-yellow-600 
            hover:bg-yellow-700
            font-semibold rounded-lg
          $ {isRacing || !isOnGarage ? 'pointer-events-none opacity-50' : ''}`}
          >
            TO WINNERS <Crown className="inline" />
          </Link>
        </div>
      </header>
    </div>
  );
}
