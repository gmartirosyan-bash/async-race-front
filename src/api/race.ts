const URL = 'http://localhost:3000/engine';

const raceApi = async (id: number, status: 'started' | 'stopped') => {
  const res = await fetch(`${URL}?status=${status}&id=${id}`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error(`Failed to ${status} the car: ${res.status}`);
  return (await res.json()) as { velocity: number; distance: number };
};

const driveApi = async (id: number, status: 'drive') => {
  const res = await fetch(`${URL}?status=${status}&id=${id}`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error(`Failed to ${status} the car: ${res.status}`);
  return (await res.json()) as { success: true };
};

export default { raceApi, driveApi };
