import { useAppSelector } from '../../redux/hooks';
import GarageCar from './GarageCar';

export default function GarageCars() {
  const cars = useAppSelector((state) => state.garage.cars);

  return (
    <div>
      {cars.map((car, i) => {
        return (
          <GarageCar car={car} index={i} />
          // <div
          //   key={car.id}
          //   className={`flex items-center border-b-white border-b-4 ${!selected || selected?.id === car.id ? 'opacity-100' : 'opacity-50'}`}
          // >
          //   <div className="flex items-center gap-4">
          //     <div className="flex flex-col gap-3 max-w-25">
          //       <button
          //         onClick={() => handleSelectCar(car)}
          //         className="px-3 font-semibold rounded-2xl bg-yellow-400 text-black"
          //       >
          //         {selected && selected.id === car.id ? 'UNSET' : 'SELECT'}
          //       </button>
          //       <button
          //         onClick={() => handleRemoveCar(car.id)}
          //         className="px-3 font-semibold rounded-2xl bg-pink-700 text-black"
          //       >
          //         REMOVE
          //       </button>
          //     </div>
          //     <div className="flex flex-col gap-3">
          //       <button
          //         onClick={() => handleDriveCar(car.id)}
          //         className="px-3 font-semibold rounded-2xl bg-green-700 text-black"
          //       >
          //         START
          //       </button>
          //       <button
          //         onClick={() => handleStopCar(car.id)}
          //         className="px-3 font-semibold rounded-2xl bg-red-700 text-black"
          //       >
          //         STOP
          //       </button>
          //     </div>
          //   </div>
          //   <div className="relative w-full h-20 overflow-hidden">
          //     <div
          //       style={{
          //         left: isMoving ? '85%' : '0%',
          //         transitionDuration: isMoving ? `${speed}ms` : '0s',
          //         width: '160px',
          //         height: '80px',
          //       }}
          //       className="absolute top-0 transition-all ease-linear"
          //     >
          //       <Car className="w-40 h-20" fill={car.color} />
          //     </div>
          //   </div>
          //   <p className="absolute left-85 -z-40 text-5xl opacity-40">{car.name}</p>
          // </div>
        );
      })}
    </div>
  );
}
