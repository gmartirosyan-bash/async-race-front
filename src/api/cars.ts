const URL = 'http://localhost:3000/garage';

export const getCars = async () => {
  const res = await fetch(URL);
  return await res.json();
};
