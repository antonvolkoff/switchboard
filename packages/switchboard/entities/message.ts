import Address from './address';

export default class Message {
  constructor(public id: string, public from: Address, public to: Array<Address>) {
  }
};
