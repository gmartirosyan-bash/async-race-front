import { useEffect } from 'react';
import { addCar, setSelected, updateCar } from '../../redux/features/garageSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setName, setColor } from '../../redux/features/garageSlice';
import createRandomCars from '../../utils/carGenerator';

export default function CarForm() {
  const selected = useAppSelector((state) => state.garage.selected);
  const name = useAppSelector((state) => state.garage.carName);
  const color = useAppSelector((state) => state.garage.carColor);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (selected) {
      dispatch(setName(selected.name));
      dispatch(setColor(selected.color));
    }
  }, [selected, dispatch]);

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !color.trim()) {
      const car = createRandomCars(1)[0];
      dispatch(addCar(car));
    } else if (selected) {
      dispatch(updateCar({ id: selected.id, newCar: { name, color } }));
      dispatch(setSelected(null));
    } else {
      dispatch(addCar({ name, color }));
    }
    dispatch(setName(''));
  };

  return (
    <>
      <form
        onSubmit={handleAddCar}
        className="flex xl:flex-row flex-col items-center font-orbitron"
      >
        <div className="flex">
          <label htmlFor="car-name" className="sr-only">
            Car Name
          </label>
          <input
            className="px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-700"
            id="car-name"
            placeholder="Enter car name"
            type="text"
            maxLength={20}
            value={name}
            onChange={(e) => dispatch(setName(e.target.value))}
          />
          <label className="ml-2 inline-flex items-center space-x-2 cursor-pointer">
            <span
              className="w-10 h-10 rounded border-red-800 border-5 active:scale-90"
              style={{ backgroundColor: color }}
            />
            <input
              type="color"
              value={color}
              onChange={(e) => dispatch(setColor(e.target.value))}
              className="w-0 h-0 overflow-hidden opacity-0"
            />
          </label>
        </div>

        <button
          type="submit"
          className="font-semibold xl:mt-0 mt-4 bg-red-800 px-4 py-2 active:scale-95 
          rounded hover:bg-red-900 hover:cursor-pointer active:bg-red-700"
        >
          {selected ? '✏️ Update The Car' : '+ Create A New Car'}
        </button>
      </form>
    </>
  );
}
