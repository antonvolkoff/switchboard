import * as express from "express";
import * as crypto from "crypto";

import { configuration } from "../configuration";

interface WebhookParams {
  timestamp: string;
  token: string;
  signature: string;
}

const generateSignature = (key: string, data: string): string => {
  return crypto.createHmac("sha256", key).update(data).digest("hex");
};

export default (signingKey: string) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { timestamp, token, signature } = <WebhookParams>req.body;

    const data = timestamp.concat(token);
    const expectedSignature = generateSignature(signingKey, data);

    if (expectedSignature === signature) {
      return next();
    }

    res.status(400).send({ ok: false, errorCode: 100 });
  };
};
