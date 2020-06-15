import { Client } from './client';
import { Config } from './config';

export class Engine extends Client {

  constructor(
    config: Config
  ) {
    super(config.setType('engine'));
  }
}
