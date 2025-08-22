import CarForm from './CarForm';
import RaceControls from './RaceControls';

export default function GarageMenu() {
  return (
    <div className="mt-20 mb-7 flex items-center justify-around gap-60">
      <RaceControls />
      <CarForm />
    </div>
  );
}
