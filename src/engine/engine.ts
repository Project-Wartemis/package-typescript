import { Game } from './game';
import { Client } from '../client';
import { ActionMessageEngine, StartMessage, StopMessage } from '../message';

export abstract class Engine<State extends object, Action extends object> extends Client {

  // prefix and suffix is expected to stay constant over all games for this implementation
  private prefix = '';
  private suffix = '';
  public neutralPlayer = '';
  private gamesById: Map<number, Game<State, Action>> = new Map();

  constructor(
    game: string,
    endpoint?: string
  ) {
    super(game, game, 'engine', endpoint);
    super.on('start', this.handleStart.bind(this));
    super.on('action', this.handleAction.bind(this));
  }

  public abstract generateInitialState(players: Array<string>): State;

  public abstract getPlayersToMove(state: State): Array<string>;

  public abstract validateAction(state: State, player: string, action: Action): string | null;

  public abstract processActions(state: State, actions: Map<string, Action>): State;

  public abstract isGameOver(state: State, turn: number): boolean;

  private mapPlayer(id: number): string {
    return this.prefix + id + this.suffix;
  }

  private mapPlayers(ids: Array<number>): Array<string> {
    return ids.map(this.mapPlayer.bind(this));
  }

  private sendState(game: Game<State, Action>): void {
    this.send(game.getStateMessage());
  }

  private sendError(player: string, error: string): void {
    console.log('Got error:' + error);
    // TODO send new engine error message
  }

  private handleStart(raw: object): void {
    const message: StartMessage = Object.assign({} as StartMessage, raw);
    this.prefix = message.prefix;
    this.suffix = message.suffix;
    this.neutralPlayer = this.mapPlayer(0);
    const state = this.generateInitialState(this.mapPlayers(message.players));
    const players = this.getPlayersToMove(state);
    const game = new Game<State, Action>(message.game, state, players);
    this.gamesById.set(message.game, game);
    this.sendState(game);
  }

  private handleAction(raw: object): void {
    const message: ActionMessageEngine = Object.assign({} as ActionMessageEngine, raw);
    const game = this.gamesById.get(message.game);
    if(!game) {
      this.sendError(message.player, `No game found for id ${message.game}`);
      return;
    }
    if(!game.isWaitingOn(message.player)) {
      this.sendError(message.player, `We currently do not expect an action for game ${message.game}`);
      return;
    }
    let action: Action;
    try {
      action = Object.assign({} as Action, message.action);
    } catch(e) {
      this.sendError(message.player, 'Could not parse the action. Please consult the documentation!');
      return;
    }
    const validationError = this.validateAction(game.getState(), message.player, action);
    if(validationError) {
      this.sendError(message.player, `Move validation failed: [${validationError}]`);
      return;
    }
    game.setAction(message.player, action);
    if(!game.isWaiting()) {
      this.handleTurn(game);
    }
  }

  private handleTurn(game: Game<State, Action>): void {
    const state = this.processActions(game.getState(), game.getActions());
    let players: Array<string>;
    if(this.isGameOver(state, game.getTurn() + 2)) {
      // game.getTurn lags behind 1, and is 0 indexed, so increment by 2 to get the turn the actual user sees
      players = [];
      this.handleGameOver(game);
    } else {
      players = this.getPlayersToMove(state);
    }
    game.update(state, players);
    this.sendState(game);
  }

  private handleGameOver(game: Game<State, Action>): void {
    this.send({
      type: 'stop',
      game: game.getId(),
    } as StopMessage);
  }
}
