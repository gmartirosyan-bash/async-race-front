import { useEffect, useState } from 'react';
import { addCar, removeCar, fetchCars } from '../redux/features/garageSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import carSvgs from '../assets/carSvgs';
import GaragePanel from '../components/Garage/GaragePanel';
import CustomMsg from '../components/CustomMsg';
import LoadingIndicator from '../components/LoadingIndicator';

export default function Garage() {
  const cars = useAppSelector((state) => state.garage.cars);
  const error = useAppSelector((state) => state.garage.error);
  const loading = useAppSelector((state) => state.garage.loading);

  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>('#ff0000');

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !color.trim()) return;
    dispatch(addCar({ name, color }));
    setName('');
  };

  const handleRemoveCar = (id: number) => {
    dispatch(removeCar(id));
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <CustomMsg />;
  return (
    <>
      <div>
        <GaragePanel
          handleAddCar={handleAddCar}
          setName={setName}
          setColor={setColor}
          name={name}
          color={color}
        ></GaragePanel>

        <div className="w-300 m-auto h-15 bg-[length:60px] bg-[url('/border.png')] bg-repeat-x bg-center"></div>

        <div>
          {cars.map((car, i) => {
            const Car = carSvgs[i % 9];
            return (
              <div key={car.id} className="flex items-center border-b-white border-b-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-3">
                    <button className="px-3 font-semibold rounded-2xl bg-yellow-400 text-black">
                      SELECT
                    </button>
                    <button
                      onClick={() => handleRemoveCar(car.id)}
                      className="px-3 font-semibold rounded-2xl bg-pink-700 text-black"
                    >
                      REMOVE
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button className="px-3 font-semibold rounded-2xl bg-green-700 text-black">
                      START
                    </button>
                    <button className="px-3 font-semibold rounded-2xl bg-red-700 text-black">
                      STOP
                    </button>
                  </div>
                </div>
                <Car className="w-40 h-20" fill={car.color} />
                <p className="ml-2">{car.name}</p>
              </div>
            );
          })}
        </div>

        <div className="w-300 m-auto h-15 bg-[length:60px] bg-[url('/border.png')] bg-repeat-x bg-center"></div>
      </div>
    </>
  );
}
