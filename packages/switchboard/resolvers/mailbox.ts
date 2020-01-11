import Message from '../entities/message';
import Address from '../entities/address';

const messages = [
  new Message(
    '1',
    new Address("choixer@gmail.com", "Anton Volkov"),
    [new Address("anton@outpostr.com", "Anton Volkov")]
  ),
  new Message(
    '2',
    new Address("choixer@gmail.com", "Anton Volkov"),
    [new Address("anton@outpostr.com", "Anton Volkov")]
  ),
];

export default {
  messages(rootValue, args) {
    return messages;
  },
};
