import type { Start } from '../types/car';

const URL = 'http://localhost:3000/engine';

const raceApi = async (id: number, status: 'started' | 'stopped' | 'drive') => {
  const res = await fetch(`${URL}?status=${status}&id=${id}`, {
    method: 'PATCH',
  });
  if (!res.ok) throw res.status;
  if (status === 'drive') return (await res.json()) as { success: boolean };
  else return (await res.json()) as Start;
};

export default { raceApi };
