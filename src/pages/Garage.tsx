import { useEffect } from 'react';
import { fetchCars } from '../redux/features/garageSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import GaragePanel from '../components/Garage/GaragePanel';
import GarageCars from '../components/Garage/GarageCars';
import CustomMsg from '../components/CustomMsg';
import Border from '../components/Garage/Border';
import LoadingIndicator from '../components/LoadingIndicator';

export default function Garage() {
  const error = useAppSelector((state) => state.garage.error);
  const loading = useAppSelector((state) => state.garage.loading);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  if (loading) return <LoadingIndicator />;
  if (error) return <CustomMsg />;
  return (
    <>
      <div className="overflow-hidden">
        <GaragePanel />
        <Border />
        <GarageCars />
        <Border />
      </div>
    </>
  );
}
