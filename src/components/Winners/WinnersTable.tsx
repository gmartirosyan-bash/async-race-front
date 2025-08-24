import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import carSvgs from '../../utils/carSvgs';
import { fetchWinners } from '../../redux/features/winnersSlice';
import EmptyWinners from './EmptyWinners';

type SortKey = 'wins' | 'time';
type SortOrder = 'asc' | 'desc';

export default function WinnersTable() {
  const dispatch = useAppDispatch();
  const winners = useAppSelector((state) => state.winners.winners);
  const page = useAppSelector((state) => state.winners.page);
  const winnersCount = useAppSelector((state) => state.winners.winnersCount);

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    dispatch(
      fetchWinners({
        sort: sortKey ?? undefined,
        order: sortOrder.toUpperCase() as 'ASC' | 'DESC',
      }),
    );
  }, [page, sortKey, sortOrder, dispatch]);

  const handleSort = (key: SortKey) => {
    const order = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(order);
  };

  return (
    <div className="overflow-x-auto mt-20 max-w-350 m-auto">
      <table className="min-w-full border-collapse border border-neutral-700 text-neutral-200">
        <thead className="bg-neutral-800 text-left">
          <tr>
            <th className="border border-neutral-700 px-4 py-2">Number</th>
            <th className="border border-neutral-700 px-4 py-2">Car</th>
            <th className="border border-neutral-700 px-4 py-2">Name</th>
            <th
              className="border border-neutral-700 px-4 py-2 cursor-pointer"
              onClick={() => handleSort('wins')}
            >
              Wins{' '}
              <span className="inline-block w-4">
                {sortKey === 'wins' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </span>
            </th>
            <th
              className="border border-neutral-700 px-4 py-2 cursor-pointer"
              onClick={() => handleSort('time')}
            >
              Best time (s){' '}
              <span className="inline-block w-4">
                {sortKey === 'time' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {winners.map((winner) => {
            const CarSvg = carSvgs[winner.id % 9];
            return (
              <tr key={winner.id}>
                <td className="border border-neutral-700 px-4 py-2">{winner.id}</td>
                <td className="border border-neutral-700 px-4 py-2">
                  <CarSvg className="w-20 h-10" fill={winner.color} />
                </td>
                <td className="border border-neutral-700 px-4 py-2">{winner.name}</td>
                <td className="border border-neutral-700 px-4 py-2">{winner.wins}</td>
                <td className="border border-neutral-700 px-4 py-2">{winner.time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {winnersCount === 0 && <EmptyWinners />}
    </div>
  );
}
