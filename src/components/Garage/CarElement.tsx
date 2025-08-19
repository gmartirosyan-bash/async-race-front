import { useAppSelector } from '../../redux/hooks';
import carSvgs from '../../assets/carSvgs';
import type { Car } from '../../types/car';
import { useEffect, useRef } from 'react';

interface GarageProps {
  car: Car;
}

export default function GarageCar({ car }: GarageProps) {
  const movingCars = useAppSelector((state) => state.garage.moving);
  const carRef = useRef<HTMLDivElement>(null);

  const CarSvg = carSvgs[car.id % 9];
  const isMoving = movingCars.some((moving) => moving.id === car.id);
  const speed = movingCars.find((moving) => moving.id === car.id)?.duration;
  const carState = movingCars.find((m) => m.id === car.id);

  useEffect(() => {
    if (!carRef.current) return;

    if (carState?.broke) {
      const computed = window.getComputedStyle(carRef.current).left;
      carRef.current.style.transition = 'none';
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
      </div>
      <p className="absolute left-85 -z-40 text-5xl opacity-40">{car.name}</p>
    </>
  );
}
