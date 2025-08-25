import { useAppSelector } from '../../redux/hooks';
import carSvgs from '../../utils/carSvgs';
import { useEffect, useRef } from 'react';
import type { Car } from '../../types/types';

interface CarElementProps {
  car: Car;
}

export default function CarElement({ car }: CarElementProps) {
  const movingCars = useAppSelector((state) => state.garage.moving);
  const carRef = useRef<HTMLDivElement>(null);

  const CarSvg = carSvgs[car.id % carSvgs.length];
  const isMoving = movingCars.some((mc) => mc.id === car.id);
  const speed = movingCars.find((mc) => mc.id === car.id)?.time;
  const carState = movingCars.find((mc) => mc.id === car.id);

  useEffect(() => {
    if (!carRef.current) return;

    if (carState?.broke) {
      const computed = window.getComputedStyle(carRef.current).left;
      carRef.current.style.left = computed;
    }
  }, [movingCars, carState]);

  return (
    <div className="relative w-full h-20 overflow-hidden lg:border-0 border-t-4 border-dashed border-amber-400">
      <div
        ref={carRef}
        style={{
          left: isMoving ? `calc(100% - 160px)` : '0%',
          transitionDuration: isMoving ? `${speed}ms` : '0s',
        }}
        className={`absolute top-0 transition-all ease-linear w-[160px] h-[80px]`}
      >
        <CarSvg className="w-full h-full" fill={car.color} />
      </div>
      <img
        src="/prefinish.png"
        alt="finish"
        className="absolute w-25 scale-160 -z-10 -top-2 xl:left-[93%] md:left-[91%] sm:left-[87%] left-[85%]"
      />
    </div>
  );
}
