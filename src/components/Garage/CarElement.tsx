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

  const CarSvg = carSvgs[car.id % 9];
  const isMoving = movingCars.some((mc) => mc.id === car.id);
  const speed = movingCars.find((mc) => mc.id === car.id)?.duration;
  const carState = movingCars.find((mc) => mc.id === car.id);

  useEffect(() => {
    if (!carRef.current) return;

    if (carState?.broke) {
      const computed = window.getComputedStyle(carRef.current).left;
      carRef.current.style.left = computed;
    }
  }, [movingCars, carState]);

  return (
    <>
      <div className="relative w-full h-20 overflow-hidden">
        <div
          ref={carRef}
          style={{
            left: isMoving ? '85%' : '0%',
            transitionDuration: isMoving ? `${speed}ms` : '0s',
            width: '160px',
            height: '80px',
          }}
          className="absolute top-0 transition-all ease-linear"
        >
          <CarSvg className="w-40 h-20" fill={car.color} />
        </div>
        <img src="/finish.png" alt="" className="w-8 absolute -z-10 left-[95%]" />
      </div>
    </>
  );
}
