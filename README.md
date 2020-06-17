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

#### handleError(error)

Argument | Type | Description
--- | --- | ---
error | string | The error message

#### handleState(state, move, game, key)

Should return the action your bot takes

Argument | Type | Description
--- | --- | ---
state | string | The game state
move | boolean | If you are expected to move on this state
game | string | The game id, this is public information and is sent to each bot in a game
key | string | The bot id, this is private information and is unique for each bot in a game

### Engine

WIP

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
