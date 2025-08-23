import { useAppSelector } from '../../redux/hooks';
import carSvgs from '../../utils/carSvgs';

export default function WinnersTable() {
  const winners = useAppSelector((state) => state.winners.winners);

  return (
    <div className="overflow-x-auto mt-20">
      <table className="min-w-full border-collapse border border-neutral-700 text-neutral-200">
        <thead className="bg-neutral-800 text-left">
          <tr>
            <th className="border border-neutral-700 px-4 py-2">Number</th>
            <th className="border border-neutral-700 px-4 py-2">Car</th>
            <th className="border border-neutral-700 px-4 py-2">Name</th>
            <th className="border border-neutral-700 px-4 py-2">Wins</th>
            <th className="border border-neutral-700 px-4 py-2">Best time (s)</th>
          </tr>
        </thead>
        <tbody>
          {winners.map((winner) => {
            const CarSvg = carSvgs[winner.id % 9];
            return (
              <tr key={winner.id} className="hover:bg-neutral-900">
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
    </div>
  );
}
