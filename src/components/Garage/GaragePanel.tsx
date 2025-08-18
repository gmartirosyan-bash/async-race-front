import CarForm from './CarForm';
import RaceControls from './RaceControls';
import NavButtons from '../NavButtons';

export default function GaragePanel() {
  return (
    <div className="mt-10 bg-[url('/Async-race.png')]  bg-center bg-no-repeat bg-contain h-70">
      <div className="ml-10">
        <NavButtons />
        <CarForm />
        <RaceControls />
      </div>
    </div>
  );
}
