import * as express from "express";
import axios from "axios";
import { resolve } from "dns";

interface InputParams {
  timestamp: number;
  token: string;
  signature: string;

  recipient: string;
  sender: string;

  "body-mime": string;
}

interface OutpostParams {
  envelope: { from: string, to: string[] };
  message: { data: string };
}

function toOutpostParams(input: InputParams): OutpostParams {
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
  const httpClient = axios.create({
    baseURL: "https://www.outpostr.com",
    timeout: 1000,
  });

  return async function(req: express.Request, res: express.Response) {
    const params = <InputParams>req.body;
    const outpostParams = toOutpostParams(params);

    const response = await httpClient.post('/api/mails', outpostParams);
    if (response.status == 200) {
      res.status(200).send({ ok: true });
    } else {
      res.status(500).send({ ok: false });
    }
  };
}
