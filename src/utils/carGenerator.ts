const brands = [
  'Tesla',
  'Ford',
  'BMW',
  'Mercedes',
  'Audi',
  'Toyota',
  'Honda',
  'Nissan',
  'Chevrolet',
  'Kia',
];

const models = [
  'Model S',
  'Mustang',
  'Civic',
  'Corolla',
  'Camaro',
  'Q7',
  'E-Class',
  'Altima',
  'Optima',
  'X5',
];

const getRandomName = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const getRandomColor = (): string => {
  const randomNum = Math.floor(Math.random() * 16777214) + 1;
  return `#${randomNum.toString(16).padStart(6, '0')}`;
};

const createRandomCar = () => {
  return {
    name: `${getRandomName(brands)} ${getRandomName(models)}`,
    color: getRandomColor(),
  };
};

const createRandomCars = (count: number = 100) => {
  return Array.from({ length: count }, () => createRandomCar());
};

export default createRandomCars;
