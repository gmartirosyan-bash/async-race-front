import { useState } from 'react';
import { addCar, removeCar } from '../redux/features/garageSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Link } from 'react-router-dom';
import carSvgs from '../assets/carSvgs';
import type { Car } from '../redux/features/garageSlice';

export default function Garage() {
  const cars = useAppSelector((state) => state.garage.cars);

  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>('#ff0000');

  const dispatch = useAppDispatch();

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !color.trim()) return;
    const newCar: Car = { id: Date.now(), name, color };
    dispatch(addCar(newCar));
    setName('');
  };

  const handleRemoveCar = (id: number) => {
    dispatch(removeCar(id));
  };

  return (
    <>
      <div className="mt-10 bg-[url('/Async-race.png')]  bg-center bg-no-repeat bg-contain h-70">
        <div className="ml-10">
          <Link
            to="/winners"
            className="inline-block bg-transparent p-4 mr-5 mb-5 text-red-500
            border-2 border-red-400 outline-2 outline-red-700 rounded-2xl"
          >
            TO WINNERS
          </Link>
          <Link
            to="/garage"
            className="inline-block bg-transparent p-4 text-blue-500
            border-2 border-blue-400 outline-2 outline-blue-700 rounded-2xl"
          >
            TO GARAGE
          </Link>
          <div className="mb-5">
            <button className="py-1 px-2 mr-6 rounded-md">Race</button>
            <button className="py-1 px-2 mr-6 rounded-md">Reset</button>
            <button className="py-1 px-2 mr-6 rounded-md">Generate Cars</button>
          </div>
          <div className="">
            <form onSubmit={handleAddCar}>
              <label htmlFor="car-name" className="sr-only">
                Car Name
              </label>
              <input
                className="mr-2 w-35 rounded px-2 py-1"
                id="car-name"
                placeholder="Enter car name"
                type="text"
                maxLength={20}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="car-color" className="sr-only">
                Car Color
              </label>
              <input
                className="w-6 h-6 mr-2 rounded cursor-pointer"
                id="car-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <button className="px-2 py-1 rounded-md" type="submit">
                Add Car
              </button>
            </form>
          </div>
        </div>
      </div>
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
    </>
  );
}
