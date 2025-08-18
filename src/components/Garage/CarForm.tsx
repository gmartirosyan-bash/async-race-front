import { useEffect, useState } from 'react';
import { addCar, setSelected, updateCar } from '../../redux/features/garageSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

export default function CarForm() {
  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>('#ff0000');

  const selected = useAppSelector((state) => state.garage.selected);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (selected) {
      setName(selected.name);
      setColor(selected.color);
    } else {
      setName('');
      setColor('#ff0000');
    }
  }, [selected]);
  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !color.trim()) return;
    if (selected) {
      dispatch(updateCar({ id: selected.id, newCar: { name, color } }));
      dispatch(setSelected(null));
    } else {
      dispatch(addCar({ name, color }));
    }
    setName('');
  };

  return (
    <>
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
        <button className="px-2 py-1 rounded-md font-semibold text-xl" type="submit">
          {selected ? 'UPDATE' : 'CREATE'}
        </button>
      </form>
    </>
  );
}
