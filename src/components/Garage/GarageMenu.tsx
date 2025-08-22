import CarForm from './CarForm';
import RaceControls from './RaceControls';
import NavButtons from '../NavButtons';

export default function GarageMenu() {
  return (
    <div className="mt-10 mb-20">
      <div>
        <NavButtons />
        <CarForm />
        <RaceControls />
      </div>
    </div>
  );
}
