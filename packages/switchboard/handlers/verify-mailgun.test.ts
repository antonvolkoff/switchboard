import * as express from "express";
import * as supertest from "supertest";
import verifyMailgun from "./verify-mailgun";

const testHandler = (req, res) => {
  res.send({ ok: true });
};
const webhookMeta = {
  timestamp: "1578936122",
  token: "438442021526ddf1ca178addfb4e35ea9178d511ae9192c1ad",
  signature: "04312b50434ddb859d0c8a5d80d97a13fd39576a510d548a8d7bab76b096ffec"
};

test("should return 200 with valid signature", async (done) => {
  const signingKey = "AAA";
  const app = express();
  app.post(
    "/webhook",
    [
      express.json(),
      verifyMailgun(signingKey),
      testHandler
    ]
  );

  const response = await supertest(app).post("/webhook").send(webhookMeta);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ ok: true });

  done();
});

test("should return 400 with invalid signature", async (done) => {
  const signingKey = "WRONG";
  const app = express();
  app.post(
    "/webhook",
    [
      express.json(),
      verifyMailgun(signingKey),
      testHandler,
    ]
  );

  const response = await supertest(app).post("/webhook").send(webhookMeta);

  expect(response.status).toEqual(400);
  expect(response.body).toEqual({ ok: false, errorCode: 100 });

  done();
});
