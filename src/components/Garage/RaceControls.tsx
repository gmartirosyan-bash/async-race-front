import { raceCars } from '../../redux/features/garageSlice';
import { useAppDispatch } from '../../redux/hooks';

export default function RaceControls() {
  const dispatch = useAppDispatch();
  const handleRace = () => {
    dispatch(raceCars());
  };

  return (
    <div className="mt-10">
      <button onClick={handleRace} className="py-1 px-2 mr-6 rounded-md">
        Race
      </button>
      <button className="py-1 px-2 mr-6 rounded-md">Reset</button>
      <button className="py-1 px-2 mr-6 rounded-md">Generate Cars</button>
    </div>
  );
}
