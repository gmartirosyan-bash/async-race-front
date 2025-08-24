import { useEffect } from 'react';
import WinnersTable from '../components/Winners/WinnersTable';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { fetchWinners } from '../redux/features/winnersSlice';

export default function Winners() {
  const page = useAppSelector((state) => state.winners.page);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchWinners());
  }, [dispatch, page]);

  return (
    <div className="overflow-hidden max-w-354 m-auto font-roboto mt-10">
      <WinnersTable />
    </div>
  );
}
