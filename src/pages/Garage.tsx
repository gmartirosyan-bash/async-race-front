import { useEffect, useState } from 'react';
import { fetchCars } from '../redux/features/garageSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import GarageMenu from '../components/Garage/GarageMenu';
import GarageCars from '../components/Garage/GarageCars';
import Border from '../components/Garage/Border';
import Page from '../components/Garage/Page';
import LoadingIndicator from '../components/LoadingIndicator';
import WinnerMsg from '../components/WinnerMsg';

export default function Garage() {
  const loading = useAppSelector((state) => state.garage.loading);
  const winner = useAppSelector((state) => state.garage.winner);
  const page = useAppSelector((state) => state.garage.page);
  const cars = useAppSelector((state) => state.garage.cars);

  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [showWinner, setShowWinner] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCars(initialLoad));
    setInitialLoad(false);
  }, [dispatch, page]);

  useEffect(() => {
    if (winner) {
      setShowWinner(true);
      const timer = setTimeout(() => {
        setShowWinner(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [winner]);

  if (loading) return <LoadingIndicator />;
  return (
    <>
      {showWinner && winner && <WinnerMsg winner={winner} />}
      <div className="overflow-hidden max-w-350 m-auto font-roboto">
        <GarageMenu />
        <Border />
        {!cars.length && <div className="text-center text-4xl text-red-700">GARAGE IS EMPTY</div>}
        <GarageCars />
        <Border />
        <Page />
      </div>
    </>
  );
}
