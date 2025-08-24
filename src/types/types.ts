export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface MovingCar {
  id: number;
  time: number;
  broke: boolean;
}

export interface Start {
  velocity: number;
  distance: number;
}

export type RaceStatus = 'idle' | 'racing' | 'finished';

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

export interface CurrentWinner {
  id: number;
  time: number;
  name: string;
}
