import * as express from "express";
import { createTransport } from "nodemailer";
import { Options as MailerOptions } from "nodemailer/lib/mailer";
import { configuration } from "../configuration";

interface InputParams {
  mail_from: string;
  rcpt_to: string[];
  data: string;
}

function sendMail(uri: string, from: string, to: string, raw: string): void {
  if (configuration.isTest()) return;

  const mailOptions: MailerOptions = { envelope: { from, to }, raw };
  createTransport(uri).sendMail(mailOptions);
}

export default function outpostrHandler() {
  return async function(req: express.Request, res: express.Response) {
    try {
      const { mail_from, rcpt_to, data } = <InputParams>req.body;
      sendMail(configuration.smtpURI, mail_from, rcpt_to.join(", "), data);

      res.send({ ok: true });
    } catch (error) {
      res.status(500).send({ ok: false });
    }
  };
}
