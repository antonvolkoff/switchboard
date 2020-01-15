import * as express from "express";

export default function outpostrHandler() {
  return async function(req: express.Request, res: express.Response) {
    res.send({ ok: true });
  }
}
