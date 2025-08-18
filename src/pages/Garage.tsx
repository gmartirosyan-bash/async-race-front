import { useEffect } from 'react';
import { fetchCars } from '../redux/features/garageSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import GaragePanel from '../components/Garage/GaragePanel';
import GarageRace from '../components/Garage/GarageRace';
import CustomMsg from '../components/CustomMsg';
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
      <div>
        <GaragePanel />

        <div className="w-300 m-auto h-15 bg-[length:60px] bg-[url('/border.png')] bg-repeat-x bg-center"></div>

        <GarageRace />

        <div className="w-300 m-auto h-15 bg-[length:60px] bg-[url('/border.png')] bg-repeat-x bg-center"></div>
      </div>
    </>
  );
}
