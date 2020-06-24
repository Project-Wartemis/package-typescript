import ws from 'websocket';

import { Message, RegisterMessage } from './message';

type MessageHandler = (raw: object) => void;

export class Client {

  private started = false;
  private connection?: ws.connection;
  private handlers: Record<string, MessageHandler> = {};

  constructor(
    private game: string,
    private name: string,
    private type: string,
    private endpoint: string = 'ws://api.wartemis.com/socket'
  ) {
    this.on('connected', this.register.bind(this));
  }

  public on(type: string, callback: MessageHandler): Client {
    this.handlers[type] = callback;
    return this;
  }

  public send(message: object): void {
    if(!this.connection) {
      console.error('connection was not set when trying to send a message');
      return;
    }
    this.connection.sendUTF(JSON.stringify(message));
  }

  public start(): void {
    if(this.started) {
      console.error('Start was already called');
      return;
    }
    this.started = true;

    const socket = new ws.client();

    socket.on('connectFailed', error => {
      console.error(`Error when connecting to ${this.endpoint} : [${error}]`);
    });

    socket.on('connect', connection => {
      this.connection = connection;

      connection.on('close', () => {
        // TODO handle this?
      });

      connection.on('message', this.handleMessage.bind(this));
    });

    socket.connect(this.endpoint);
  }

  private register(): void {
    this.send({
      type: 'register',
      clientType: this.type,
      game: this.game,
      name: this.name,
    } as RegisterMessage);
  }

  private handleMessage(iMessage: ws.IMessage): void {
    if(iMessage.type !== 'utf8') {
      return;
    }
    if(!iMessage.utf8Data) {
      return;
    }
    const raw: object = JSON.parse(iMessage.utf8Data);
    const message: Message = Object.assign({} as Message, raw);
    const handler = this.handlers[message.type];
    if(handler) {
      handler(raw);
    }
  }

}
