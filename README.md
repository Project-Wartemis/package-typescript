# Typescript Package for Wartemis

This provides an easy way to create a bot or an engine using typescript / javascript

## Usage

> npm install -S wartemis

> import { Bot, Config } from 'wartemis';

## Example bot

### JavaScript

```JavaScript
new Bot(new Config('Tic Tac Toe', 'Test Bot'))
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

new Bot(new Config('Tic Tac Toe', 'Robbot'))
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
