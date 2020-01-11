import Mailbox from "./mailbox";

test("should return list of messages", () => {
  const messages = Mailbox.messages({}, {});

  expect(messages.length).toEqual(2);
  expect(messages[0].id).toEqual('1');
  expect(messages[1].id).toEqual('2');
});