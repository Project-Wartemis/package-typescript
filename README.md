# Typescript Package for Wartemis

This provides an easy way to create a bot or an engine using typescript / javascript

## Installation

> $ npm install -S wartemis

## Usage

1. Make a class that extends the Bot or Engine class
2. Implement the required methods (see [API](#api))
3. Call `start()` exactly once

### JavaScript

> const { Bot, Engine } = require('wartemis');

### TypeScript

> import { Bot, Engine } from 'wartemis';

## API

### Bot

#### constructor(name, sendSilentState, endpoint)

Argument | Type | Default | Description
--- | --- | --- | ---
game | string | - | The game your bot is made for
name | string | - | The name of your bot
sendSilentState | boolean | false | Whether or not your bot will receive state messages that don't expect an answer
endpoint | string | ws://api.wartemis.com/socket | What endpoint to connect to

#### handleError(error): void

Argument | Type | Description
--- | --- | ---
error | string | The error message

#### handleState(state, move, game, key): Action

Should return the action your bot takes

Argument | Type | Description
--- | --- | ---
state | string | The game state
move | boolean | If you are expected to move on this state
game | string | The game id, this is public information and is sent to each bot in a game
key | string | The bot id, this is private information and is unique for each bot in a game

### Engine

There are 2 variable types that are used as parameters/return type: `State` and `Action`.
These are defined by the implementation of your engine.
`State` is what is serialised and sent to the bot.
`Action` is what bots send out and you receive.
When using TypeScript, you have to specify State and Action as generics. ([example](https://github.com/Project-Wartemis/engine-tic-tac-toe/blob/development/src/engine-tic-tac-toe.ts))

It exposes a field `neutralPlayer`, should you need it.

#### constructor(game, endpoint)

Argument | Type | Default | Description
--- | --- | --- | ---
game | string | - | The name of the game that your engine is made for
endpoint | string | ws://api.wartemis.com/socket | What endpoint to connect to

#### generateInitialState(players): State

Is called once before every game, to get an initial state.

Argument | Type | Description
--- | --- | ---
players | Array<string> | The player ids in this game

#### getPlayersToMove(state): Array<string>

Is called after all moves have been made.
Should return a list of player ids that are expected to send an action.

Argument | Type | Description
--- | ---| ---
state | State | The current state of the game

#### isGameOver(state, turn): boolean

Is called after all moves have been made.
Should return true if the game needs to stop, false otherwise.

Argument | Type | Description
--- | --- | ---
state | State | The current state of the game
turn | number | The current turn (1 indexed, as seen by a spectator)

#### processActions(state, actions): State

Is called after all expected actions have been received.
Should return the new game state.

Argument | Type | Description
--- | --- | ---
state | State | The current state of the game
actions | Map<string, Action> | All actions, mapped by player id

#### validateAction(state, player, action): string | null

Is called after an action was received from a player.
Return null if this is a valid action, or a non-empty string if it is not.
This message will be sent to the client, and their action will be ignored.

Argument | Type | Description
--- | --- | ---
state | State | The current state of the game
player | string | The player id
action | Action | The action sent by the player

## Example bot (Tic Tac Toe)

### JavaScript

```JavaScript
const { Bot } = require('wartemis');

class BotTicTacToe extends Bot {

  constructor() {
    super('Tic Tac Toe', 'Demobot');
  }

  handleError(error) {
    console.error(error);
  }

  handleState(state) {
    console.log(state);
    return {
      position: state.board.indexOf(' ')
    };
  }

}

const bot = new BotTicTacToe();
bot.start();
```

### TypeScript

```TypeScript
import { Bot } from 'wartemis';

interface State {
  board: string;
  symbol: string;
}

interface Action {
  position: number;
}

class BotTicTacToe extends Bot {

  constructor() {
    super('Tic Tac Toe', 'Demobot');
  }

  handleError(error: string): void {
    console.error(error);
  }

  handleState(state: State): Action {
    return {
      position: state.board.indexOf(' ')
    };
  }
}

const bot = new BotTicTacToe();
bot.start();
```

## Example engine

> [See the implementation for Tic Tac Toe](https://github.com/Project-Wartemis/engine-tic-tac-toe)
