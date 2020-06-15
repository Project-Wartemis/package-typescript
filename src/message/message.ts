export interface Message {
  type: string;
}

export interface ActionMessage extends Message {
  game: number;
  key: string;
  action: object;
}

export interface ErrorMessage extends Message {
  content: string;
}

export interface RegisterMessage extends Message {
  clientType: string;
  game: string;
  name: string;
}

export interface StartMessage extends Message {
  game: number;
  players: Array<number>;
  prefix: string;
  suffix: string;
}

export interface StateMessage extends Message {
  game: number;
  key: string;
  turn: number;
  move: boolean;
  state: object;
}

export interface StateEngineMessage extends Message {
  game: number;
  turn: number;
  players: Array<string>;
  state: object;
}

export interface StopMessage extends Message {
  game: number;
}
