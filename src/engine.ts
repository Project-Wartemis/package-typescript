import { Client } from './client';

export class Engine extends Client {

  constructor(
    game: string,
    endpoint?: string
  ) {
    super(game, game, 'engine', endpoint);
  }

  // TODO provide functionality
}
