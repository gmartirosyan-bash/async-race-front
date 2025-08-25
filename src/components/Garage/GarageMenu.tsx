import CarForm from './CarForm';
import RaceControls from './RaceControls';

export default function GarageMenu() {
  return (
    <div className="lg:mt-20 mt-15 mb-7 flex lg:flex-row flex-col-reverse items-center justify-around lg:gap-60 gap-10">
      <RaceControls />
      <CarForm />
    </div>
  );
}
