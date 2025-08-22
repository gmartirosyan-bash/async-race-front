import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { nextPage, prevPage, resetCars } from '../redux/features/garageSlice';
import { SquareChevronLeft, SquareChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const page = useAppSelector((state) => state.garage.page);
  const carsCount = useAppSelector((state) => state.garage.carsCount);
  const raceStatus = useAppSelector((status) => status.garage.raceStatus);

  const location = useLocation();
  const dispatch = useAppDispatch();

  const isRacing = raceStatus === 'racing';
  const isOnGarage = location.pathname === '/garage';

  const handlePrevPage = () => {
    dispatch(resetCars());
    dispatch(prevPage());
  };

  const handleNextPage = () => {
    dispatch(resetCars());
    dispatch(nextPage());
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
            PAGE #{page}/{Math.ceil(carsCount / 7)}
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
          {isOnGarage ? 'GARAGE' : 'WINNERS'} ({carsCount})
        </div>
      </div>
    </footer>
  );
}
