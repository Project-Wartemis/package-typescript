import { Client } from './client';
import { ActionMessage, ErrorMessage, StateMessage } from './message/message';

export class Bot extends Client {

  constructor(
    game: string,
    name: string,
    private sendSilentState: boolean = false,
    endpoint?: string
  ) {
    super(game, name, 'bot', endpoint);
  }

  public onState(callback: (state: object, move: boolean, game: number, key: string) => object): Bot {
    super.on('state', (raw: object) => {
      const message: StateMessage = Object.assign({} as StateMessage, raw);
      if(!message.move && !this.sendSilentState) {
        return;
      }
      const action = callback(message.state, message.move, message.game, message.key);
      if(message.move) {
        super.send({
          type: 'action',
          game: message.game,
          key: message.key,
          action
        } as ActionMessage);
      }
    });
    return this;
  }

  public onError(callback: (content: string) => void): Bot {
    super.on('error', (raw: object) => {
      const message: ErrorMessage = Object.assign({} as ErrorMessage, raw);
      callback(message.content);
    });
    return this;
  }

}
