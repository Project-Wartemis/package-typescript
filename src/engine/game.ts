import { StateMessageEngine } from '../message';

export class Game<State extends object, Action extends object> {

  private turn: number;
  private players: Set<string>;
  private actionsByPlayer: Map<string, Action>;

  constructor(
    private id: number,
    private state: State,
    players: Array<string>
  ) {
    this.turn = -1;
    this.players = new Set();
    this.actionsByPlayer = new Map();
    this.update(state, players);
  }

  public getTurn(): number {
    return this.turn;
  }

  public getPlayers(): Array<string> {
    return Array.from(this.players);
  }

  public isWaiting(): boolean {
    return this.players.size !== 0;
  }

  public isWaitingOn(player: string): boolean {
    return this.players.has(player);
  }

  public getId(): number {
    return this.id;
  }

  public getState(): State {
    return this.state;
  }

  public getActions(): Map<string, Action> {
    return this.actionsByPlayer;
  }

  public update(state: State, players: Array<string>): void {
    this.state = state;
    this.turn++;
    this.players = new Set(players);
    this.actionsByPlayer.clear();
  }

  public setAction(player: string, action: Action): void {
    this.players.delete(player);
    this.actionsByPlayer.set(player, action);
  }

  public getStateMessage(): StateMessageEngine {
    const players: Array<string> = [];
    for(const player of this.players) {
      players.push(player);
    }
    return {
      type: 'state',
      game: this.id,
      turn: this.turn,
      players,
      state: this.state,
    } as StateMessageEngine;
  }
}
