import { useEffect, useState } from 'react';
import { clearWinner, fetchCars } from '../redux/features/garageSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import GarageMenu from '../components/Garage/GarageMenu';
import GarageCars from '../components/Garage/GarageCars';
import Border from '../components/Garage/Border';
import Page from '../components/Garage/Page';
import LoadingIndicator from '../components/LoadingIndicator';
import WinnerMsg from '../components/WinnerMsg';
import EmptyGarage from '../components/Garage/EmpyGarage';

export default function Garage() {
  const loading = useAppSelector((state) => state.garage.loading);
  const winner = useAppSelector((state) => state.garage.winner);
  const page = useAppSelector((state) => state.garage.page);
  const carsCount = useAppSelector((state) => state.garage.carsCount);

  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [showWinner, setShowWinner] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCars(initialLoad));
    setInitialLoad(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  if (loading) return <LoadingIndicator />;
  return (
    <>
      {showWinner && winner && <WinnerMsg winner={winner} />}
      <div className="overflow-hidden max-w-350 m-auto font-roboto">
        <GarageMenu />
        <Border />
        {carsCount === 0 && <EmptyGarage />}
        <GarageCars />
        <Border />
        <Page />
      </div>
    </>
  );
}
