import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { nextPage, prevPage } from '../../redux/features/garageSlice';
import { SquareChevronLeft, SquareChevronRight } from 'lucide-react';

const Page = () => {
  const page = useAppSelector((state) => state.garage.page);
  const carsCount = useAppSelector((state) => state.garage.carsCount);

  const dispatch = useAppDispatch();

  const handlePrevPage = () => {
    dispatch(prevPage());
  };

  const handleNextPage = () => {
    dispatch(nextPage());
  };

  return (
    <div className="flex justify-around gap-200 mt-4 font-roboto text-red-800 font-semibold">
      <div className="flex">
        <button className="active:text-red-700 active:scale-90" onClick={handlePrevPage}>
          <SquareChevronLeft strokeWidth={3} size={25} />
        </button>
        <p className="text-3xl mx-1 text-neutral-300">
          PAGE #{page}/{Math.ceil(carsCount / 7)}
        </p>
        <button className="active:text-red-700 active:scale-90" onClick={handleNextPage}>
          <SquareChevronRight strokeWidth={3} size={25} />
        </button>
      </div>
      <div className="text-3xl text-neutral-300">GARAGE ({carsCount})</div>
    </div>
  );
};

export default Page;
