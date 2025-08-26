import { useEffect, useState } from 'react';
import { fetchCars } from '../redux/features/garageSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import GarageMenu from '../components/Garage/GarageMenu';
import GarageCars from '../components/Garage/GarageCars';
import WinnerMsg from '../components/Garage/WinnerMsg';
import EmptyGarage from '../components/Garage/EmpyGarage';
import { clearWinner } from '../redux/features/winnersSlice';

export default function Garage() {
  const page = useAppSelector((state) => state.garage.page);
  const carsCount = useAppSelector((state) => state.garage.carsCount);
  const winner = useAppSelector((state) => state.winners.currentWinner);

  const [showWinner, setShowWinner] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch, page]);

  useEffect(() => {
    if (winner) {
      setShowWinner(true);
      const timer = setTimeout(() => {
        setShowWinner(false);
        dispatch(clearWinner());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, winner]);

  return (
    <>
      {showWinner && winner && <WinnerMsg winner={winner} />}
      <div className="overflow-hidden lg:max-w-350  m-auto font-roboto">
        <GarageMenu />
        {carsCount === 0 && <EmptyGarage />}
        <GarageCars />
      </div>
    </>
  );
}
