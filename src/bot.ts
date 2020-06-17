import { Client } from './client';
import { ActionMessage, ErrorMessage, StateMessage } from './message/message';

export abstract class Bot extends Client {

  constructor(
    game: string,
    name: string,
    private sendSilentState: boolean = false,
    endpoint?: string
  ) {
    super(game, name, 'bot', endpoint);
    this.registerErrorHandler();
    this.registerStateHandler();
  }

  public abstract handleError(error: string): void;

  public abstract handleState(state: object, move: boolean, game: number, key: string): object;

  private registerErrorHandler(): void {
    super.on('error', (raw: object) => {
      const message: ErrorMessage = Object.assign({} as ErrorMessage, raw);
      this.handleError(message.content);
    });
  }

  private registerStateHandler(): void {
    super.on('state', (raw: object) => {
      const message: StateMessage = Object.assign({} as StateMessage, raw);
      if(!message.move && !this.sendSilentState) {
        return;
      }
      const action = this.handleState(message.state, message.move, message.game, message.key);
      if(message.move) {
        super.send({
          type: 'action',
          game: message.game,
          key: message.key,
          action
        } as ActionMessage);
      }
    });
  }

}
