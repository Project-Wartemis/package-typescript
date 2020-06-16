# Typescript Package for Wartemis

This provides an easy way to create a bot or an engine using typescript / javascript

## Installation

> $ npm install -S wartemis

## Usage

> import { Bot, Engine } from 'wartemis';

## API

### Bot

Method | Argument | Type | Description
--- | --- | --- | ---
constructor | game | string | The game your bot is made for
--- | name | string | The name of your bot
--- | sendSilentState | boolean | Whether or not your bot will receive state messages that don't expect an answer<br>Defaults to false
--- | endpoint | string | What endpoint to connect to<br>Defaults to ws://api.wartemis.com/socket
--- | returns | Bot | Constructing something returns an instance of that type
onState | callback | function | The callback to be executed once a state is received
--- | returns | Bot | For method chaining
onState.callback | state | object | The state
--- | move | boolean | If you are expected to move on this state
--- | game | number | The game id, this is public information and is sent to each bot in a game
--- | key | string | The bot id, this is private information and is unique for each bot in a game
--- | returns | object | The action your bot takes.
onError | callback | function | The callback to be executed once an error is received
--- | returns | Bot | For method chaining
onError.callback | error | string | The error message
start | - | - | Connects and registers with the server
--- | returns | Bot | For method chaining

### Engine

WIP

## Example bot (Tic Tac Toe)

### JavaScript

```JavaScript
new Bot('Tic Tac Toe', 'Test Bot')
  .onError(console.error)
  .onState(state => ({
    position: state.board.indexOf(' ')
  }))
  .start();
```

### TypeScript

```TypeScript
interface State {
  board: string;
  symbol: string;
}

interface Action {
  position: number;
}

new Bot('Tic Tac Toe', 'Robbot')
  .onError(console.error)
  .onState(raw => {
    const state: State = Object.assign({} as State, raw);
    return {
      position: state.board.indexOf(' ')
    } as Action;
  })
  .start();
```

## Example engine

WIP
