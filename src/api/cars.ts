import type { Car } from '../types/car';

const URL = 'http://localhost:3000/garage';

export const getCars = async () => {
  const res = await fetch(URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch cars: ${res.status}`);
  }
  return (await res.json()) as Car[];
};
