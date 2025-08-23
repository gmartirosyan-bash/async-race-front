const URL = 'http://localhost:3000/winners';

interface Winner {
  id: number;
  wins: number;
  time: number;
}

const getWinnerApi = async (id: number): Promise<Winner> => {
  const res = await fetch(`${URL}/${id}`);
  if (!res.ok) throw new Error(`failed to fetch the winner: ${res.status}`);
  return (await res.json()) as Winner;
};

const addWinnerApi = async (carObj: Winner): Promise<Winner> => {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carObj),
  });
  if (!res.ok) throw new Error(`Failed to add a winner: ${res.status}`);
  return (await res.json()) as Winner;
};

const updateWinnerApi = async (id: number, carObj: Omit<Winner, 'id'>): Promise<Winner> => {
  const res = await fetch(`${URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carObj),
  });
  if (!res.ok) throw new Error(`Failed to update the winner: ${res.status}`);
  return (await res.json()) as Winner;
};

export default { getWinnerApi, addWinnerApi, updateWinnerApi };
