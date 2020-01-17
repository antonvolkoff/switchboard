import * as express from "express";
import { createTransport } from "nodemailer";
import { Options as MailerOptions } from "nodemailer/lib/mailer";

interface InputParams {
  mail_from: string;
  rcpt_to: string[];
  data: string;
}

function send(uri: string, from: string, to: string, raw: string): void {
  if (process.env.NODE_ENV == 'test') return;

  const mailOptions: MailerOptions = { envelope: { from, to }, raw };
  createTransport(uri).sendMail(mailOptions);
}

export default function outpostrHandler() {
  const smtpURI = "smtps://username:password@example.com:25";

  return async function(req: express.Request, res: express.Response) {
    try {
      const params = <InputParams>req.body;
      send(smtpURI, params.mail_from, params.rcpt_to.join(", "), params.data);

      res.send({ ok: true });
    } catch (error) {
      res.status(500).send({ ok: false });
    }
  };
}
