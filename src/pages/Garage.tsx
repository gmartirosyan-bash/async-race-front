import { useEffect } from 'react';
import { fetchCars } from '../redux/features/garageSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import GarageMenu from '../components/Garage/GarageMenu';
import GarageCars from '../components/Garage/GarageCars';
import CustomMsg from '../components/CustomMsg';
import Border from '../components/Garage/Border';
import Page from '../components/Garage/Page';
import LoadingIndicator from '../components/LoadingIndicator';

export default function Garage() {
  const error = useAppSelector((state) => state.garage.error);
  const loading = useAppSelector((state) => state.garage.loading);
  const winner = useAppSelector((state) => state.garage.winner);
  const page = useAppSelector((state) => state.garage.page);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch, page]);

  if (loading) return <LoadingIndicator />;
  if (error) return <CustomMsg />;
  return (
    <>
      <div className="overflow-hidden max-w-350 m-auto font-roboto">
        <GarageMenu />
        <Border />
        {winner && <div>winner is {winner}</div>}
        <GarageCars />
        <Border />
        <Page />
      </div>
    </>
  );
}
