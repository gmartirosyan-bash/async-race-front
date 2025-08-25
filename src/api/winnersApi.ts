const URL = 'http://localhost:3000/winners';
import type { WinnerRaw } from '../types/types';

const getWinnersApi = async (
  page: number,
  sort?: 'wins' | 'time',
  order?: 'ASC' | 'DESC',
): Promise<{ winners: WinnerRaw[]; totalCount: number }> => {
  let url = `${URL}?_page=${page}&_limit=10`;
  if (sort) url += `&_sort=${sort}`;
  if (order) url += `&_order=${order}`;

  const res = await fetch(url);
  if (!res.ok) throw res;

  const totalCount = Number(res.headers.get('X-Total-Count'));
  const winners = (await res.json()) as WinnerRaw[];

  return { winners, totalCount };
};

const getWinnerApi = async (id: number): Promise<WinnerRaw> => {
  const res = await fetch(`${URL}/${id}`);
  if (!res.ok) throw res;
  return (await res.json()) as WinnerRaw;
};

const addWinnerApi = async (carObj: WinnerRaw): Promise<WinnerRaw> => {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carObj),
  });
  if (!res.ok) throw res;
  return (await res.json()) as WinnerRaw;
};

const updateWinnerApi = async (id: number, carObj: Omit<WinnerRaw, 'id'>): Promise<WinnerRaw> => {
  const res = await fetch(`${URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carObj),
  });
  if (!res.ok) throw res;
  return (await res.json()) as WinnerRaw;
};

const removeWinnerApi = async (id: number) => {
  const res = await fetch(`${URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw res;
};

export default { getWinnersApi, getWinnerApi, addWinnerApi, updateWinnerApi, removeWinnerApi };
