import * as Outpostr from "outpostr";
import { increment } from "../metrics";
import Message from "../message";

const eventName = 'inbound';

const matchTo = function(message: Message, pattern: string): boolean {
  return message.rcpt_to.every((to) => to.includes(pattern));
};

const overwriteRcptTo = function(message: Message, to: string): Message {
  message.rcpt_to = [to];
  return message;
};

const send = async function(message: Message) {
  const outpostrEmail: Outpostr.Email = {
    envelope: { from: message.mail_from, to: message.rcpt_to },
    message: { data: message.data },
  };
  return Outpostr.createIncomingEmail(outpostrEmail);
};

const listener = async function(message: Message) {
  if (matchTo(message, "@outpostr.com")) {
    send(message);
    increment("mail.sent.count");
  }

  if (matchTo(message, "contact@antonvolkoff.com")) {
    message = overwriteRcptTo(message, "anton@outpostr.com");
    await send(message);
    increment("mail.sent.count");
  }
};

export { eventName, listener }
