import NavButtons from '../components/NavButtons';
import WinnersTable from '../components/Winners/WinnersTable';

export default function Winners() {
  return (
    <>
      <div className="overflow-hidden max-w-354 m-auto font-roboto mt-10">
        <NavButtons />
        <WinnersTable />
      </div>
    </>
  );
}
