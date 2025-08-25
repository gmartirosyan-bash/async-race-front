import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import carSvgs from '../../utils/carSvgs';
import { fetchWinners } from '../../redux/features/winnersSlice';

type SortKey = 'wins' | 'time';
type SortOrder = 'ASC' | 'DESC';

export default function WinnersTable() {
  const dispatch = useAppDispatch();
  const winners = useAppSelector((state) => state.winners.winners);
  const page = useAppSelector((state) => state.winners.page);

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);

  const MS_IN_SECOND = 1000;

  useEffect(() => {
    dispatch(
      fetchWinners({
        sort: sortKey ?? undefined,
        order: sortOrder ?? undefined,
      }),
    );
  }, [page, sortKey, sortOrder, dispatch]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortOrder === 'ASC') {
        setSortOrder('DESC');
      } else {
        setSortOrder('ASC');
      }
    } else {
      setSortKey(key);
      setSortOrder('ASC');
    }
  };

  return (
    <div className="overflow-x-auto mt-20 max-w-300 m-auto text-center">
      <table className="table-fixed w-full border-collapse border border-neutral-700 text-neutral-200">
        <thead className="bg-neutral-800 font-orbitron">
          <tr>
            <th className="border border-neutral-700 px-4 py-2 sm:w-auto w-24">Number</th>
            <th className="border border-neutral-700 px-4 py-2">Car</th>
            <th className="border border-neutral-700 px-4 py-2">Name</th>
            <th
              className="border border-neutral-700 px-4 py-2 sm:w-auto w-24 cursor-pointer"
              onClick={() => handleSort('wins')}
            >
              Wins{' '}
              <span className="inline-block w-4">
                {sortKey === 'wins' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
              </span>
            </th>
            <th
              className="border border-neutral-700 px-4 py-2 sm:w-auto w-24 cursor-pointer"
              onClick={() => handleSort('time')}
            >
              Best time (s){' '}
              <span className="inline-block w-4">
                {sortKey === 'time' ? (sortOrder === 'ASC' ? '↑' : '↓') : ''}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {winners.map((winner) => {
            const CarSvg = carSvgs[winner.id % carSvgs.length];
            return (
              <tr key={winner.id}>
                <td className="border border-neutral-700 px-4 py-2">{winner.id}</td>
                <td className="border border-neutral-700 px-4 py-2">
                  <CarSvg className="sm:w-20 sm:h-10 w-14 h-7 m-auto" fill={winner.color} />
                </td>
                <td className="border border-neutral-700 px-4 py-2 break-words">{winner.name}</td>
                <td className="border border-neutral-700 px-4 py-2">{winner.wins}</td>
                <td className="border border-neutral-700 px-4 py-2">
                  {Math.floor(winner.time) / MS_IN_SECOND}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
