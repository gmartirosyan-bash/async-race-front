import { useAppSelector } from '../redux/hooks';
import WinnersTable from '../components/Winners/WinnersTable';
import EmptyWinners from '../components/Winners/EmptyWinners';

export default function Winners() {
  const winnersCount = useAppSelector((state) => state.winners.winnersCount);

  const noWinners = winnersCount === 0 ? true : false;

  return (
    <div className="overflow-hidden max-w-354 m-auto font-roboto mt-10">
      <WinnersTable />
      {noWinners && <EmptyWinners />}
    </div>
  );
}
