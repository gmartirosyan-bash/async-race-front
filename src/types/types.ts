export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface Start {
  velocity: number;
  distance: number;
}

export interface Winner {
  id: number;
  name: string;
  color: string;
  wins: number;
  time: number;
}

export interface WinnerRaw {
  id: number;
  wins: number;
  time: number;
}
