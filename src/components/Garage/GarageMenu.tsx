import CarForm from './CarForm';
import RaceControls from './RaceControls';

export default function GarageMenu() {
  return (
    <div className="sm:mt-20 mt-15 mb-7 flex sm:flex-row flex-col-reverse items-center justify-around sm:gap-60 gap-10">
      <RaceControls />
      <CarForm />
    </div>
  );
}
