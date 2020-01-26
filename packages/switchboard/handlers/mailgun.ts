import * as express from "express";
import { increment } from "../metrics";
import MailBus from "../mail-bus";

interface InputParams {
  recipient: string;
  sender: string;
  "body-mime": string;
}

export default function(mailBus: MailBus) {
  return async function(req: express.Request, res: express.Response) {
    increment("mail.received.count");

    const params = <InputParams>req.body;
    mailBus.inbound({
      mail_from: params.sender,
      rcpt_to: [params.recipient],
      data: params["body-mime"],
    });

    res.status(200).send({ ok: true });
  };
}
