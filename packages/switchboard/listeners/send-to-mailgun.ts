import { createTransport } from "nodemailer";
import { Options as MailerOptions } from "nodemailer/lib/mailer";
import { increment } from "../metrics";
import { configuration } from "../configuration";
import Message from "../message";

const eventName = 'inbound';

const matchFrom = function(message: Message, match: string): boolean {
  return message.mail_from.includes(match);
};

const send = async function(message: Message) {
  const mailOptions: MailerOptions = {
    envelope: {
      from: message.mail_from,
      to: message.rcpt_to.join(", "),
    },
    raw: message.data,
  };
  return createTransport(configuration.smtpURI).sendMail(mailOptions);
};

const listener = async function(message: Message) {
  if (configuration.isTest()) return;

  if (matchFrom(message, "anton@outpostr.com")) {
    await send(message);
    increment("mail.sent.count");
  }

  if (matchFrom(message, "contact@antonvolkoff.com")) {
    await send(message);
    increment("mail.sent.count");
  }
};

export { eventName, listener }
