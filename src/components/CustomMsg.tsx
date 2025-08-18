import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setError } from '../redux/features/garageSlice';

export default function CustomMsg() {
  const error = useAppSelector((state) => state.garage.error);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setError(null));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-10">
      <h1>{error}</h1>
      <button onClick={handleClose}>close</button>
    </div>
  );
}
