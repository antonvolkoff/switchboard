import * as EventEmitter from "events";

const InboundEvent = 'inbound';
const maxHistoryLength = 10;

export default class MailBus extends EventEmitter {
  public history: Object[];

  constructor() {
    super();

    this.history = [];
    this.addListener(InboundEvent, this.addToHistory);
  }

  inbound(message): void {
    this.emit(InboundEvent, message);
  }

  private addToHistory(message) {
    this.history.push(message);

    if (this.history.length > maxHistoryLength) {
      this.history = this.history.slice(-maxHistoryLength);
    }
  }
}
