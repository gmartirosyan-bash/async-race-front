import type { Car } from '../types/car';

const URL = 'http://localhost:3000/garage';

const getCarsApi = async (): Promise<Car[]> => {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Failed to fetch cars: ${res.status}`);
  return (await res.json()) as Car[];
};

const addCarApi = async (carObj: { name: string; color: string }): Promise<Car> => {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carObj),
  });
  if (!res.ok) throw new Error(`Failed to add a car: ${res.status}`);
  return (await res.json()) as Car;
};

const removeCarApi = async (id: number) => {
  const res = await fetch(`${URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw Error(`failed to remove the car: ${res.status}`);
};

const updateCarApi = async (id: number, carObj: { name: string; color: string }): Promise<Car> => {
  const res = await fetch(`${URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carObj),
  });
  if (!res.ok) throw new Error('Failed to update the car: ${res.status}');
  return (await res.json()) as Car;
};

export default { getCarsApi, addCarApi, removeCarApi, updateCarApi };
