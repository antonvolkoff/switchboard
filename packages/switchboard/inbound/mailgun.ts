import * as express from "express";

export function mailgunHandler() {
  return function(req: express.Request, res: express.Response) {
    console.log(req.headers);
    console.log(req.body);
    res.send({ok: true});
  };
};
