export class Config {

  constructor(
    public game: string,
    public name: string,
    public endpoint: string = '',
    public type: string = 'bot',
  ) {
    if(!this.endpoint) {
      this.endpoint = 'ws://api.wartemis.com/socket';
    }
  }

  public setType(type: string): Config {
    this.type = type;
    return this;
  }

}
