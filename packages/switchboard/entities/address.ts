export default class Address {
  public text: string

  constructor(public address: string, public name: string) {
    this.text = `${name} <${address}>`;
  }
}
