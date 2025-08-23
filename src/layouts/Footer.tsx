import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { nextCarsPage, prevCarsPage, resetCars } from '../redux/features/garageSlice';
import { SquareChevronLeft, SquareChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { nextWinnersPage, prevWinnersPage } from '../redux/features/winnersSlice';

export default function Footer() {
  const carsPage = useAppSelector((state) => state.garage.page);
  const winnersPage = useAppSelector((state) => state.winners.page);
  const carsCount = useAppSelector((state) => state.garage.carsCount);
  const winnersCount = useAppSelector((state) => state.winners.winnersCount);
  const raceStatus = useAppSelector((status) => status.garage.raceStatus);

  const location = useLocation();
  const dispatch = useAppDispatch();

  const isRacing = raceStatus === 'racing';
  const isOnGarage = location.pathname === '/garage';

  const handlePrevPage = () => {
    if (isOnGarage) {
      dispatch(resetCars());
      dispatch(prevCarsPage());
    } else {
      dispatch(prevWinnersPage());
    }
  };

  const handleNextPage = () => {
    if (isOnGarage) {
      dispatch(resetCars());
      dispatch(nextCarsPage());
    } else {
      dispatch(nextWinnersPage());
    }
  };

  return (
    <footer>
      <div className="m-auto max-w-300 flex items-center justify-between mt-8 mb-12 text-red-800 font-semibold">
        <div className="flex">
          <button
            className={`w-8 h-8 flex items-center justify-center 
            active:text-red-700 active:scale-90 
            ${isRacing ? 'pointer-events-none opacity-50' : ''}`}
            onClick={handlePrevPage}
          >
            <SquareChevronLeft strokeWidth={3} size={25} />
          </button>
          <p className="text-3xl mx-1 text-neutral-300">
            PAGE #{isOnGarage ? carsPage : winnersPage}/
            {isOnGarage ? Math.ceil(carsCount / 7) : Math.ceil(winnersCount / 10)}
          </p>
          <button
            className={`w-8 h-8 flex items-center justify-center 
            active:text-red-700 active:scale-90 
            ${isRacing ? 'pointer-events-none opacity-50' : ''}`}
            onClick={handleNextPage}
          >
            <SquareChevronRight strokeWidth={3} size={25} />
          </button>
        </div>
        <div className="text-3xl text-neutral-300">
          {isOnGarage ? 'GARAGE' : 'WINNERS'} ({isOnGarage ? carsCount : winnersCount})
        </div>
      </div>
    </footer>
  );
}
