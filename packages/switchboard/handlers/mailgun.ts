import * as express from "express";
import { createIncomingEmail, mock, Email } from "outpostr";
import { configuration } from "../configuration";

interface InputParams {
  timestamp: number;
  token: string;
  signature: string;

  recipient: string;
  sender: string;

  "body-mime": string;
}

function toOutpost(input: InputParams): Email {
  return {
    envelope: {
      from: input.sender,
      to: [input.recipient],
    },
    message: {
      data: input["body-mime"],
    },
  };
}

export function mailgunHandler() {
  let forwardFunc : any;
  if (configuration.isTest()) {
    forwardFunc = mock.createIncomingEmail;
  } else {
    forwardFunc = createIncomingEmail;
  }

  return async function(req: express.Request, res: express.Response) {
    const params = <InputParams>req.body;
    const email = toOutpost(params);

    const success = await forwardFunc(email);
    if (success) {
      res.status(200).send({ ok: true });
    } else {
      res.status(500).send({ ok: false });
    }
  };
}
