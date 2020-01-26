import * as express from "express";
import { createTransport } from "nodemailer";
import { Options as MailerOptions } from "nodemailer/lib/mailer";
import { configuration } from "../configuration";
import { increment } from "../metrics";
import MailBus from "../mail-bus";

interface InputParams {
  mail_from: string;
  rcpt_to: string[];
  data: string;
}

function sendMail(uri: string, from: string, to: string, raw: string): Promise<any> {
  if (configuration.isTest()) return;

  const mailOptions: MailerOptions = { envelope: { from, to }, raw };
  return createTransport(uri).sendMail(mailOptions);
}

export default function outpostrHandler(mailBus: MailBus) {
  return function(req: express.Request, res: express.Response) {
    increment("mail.received.count");

    const { mail_from, rcpt_to, data } = <InputParams>req.body;
    mailBus.inbound({ mail_from, rcpt_to, data });

    res.send({ ok: true });
  };
}
