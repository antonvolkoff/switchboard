import * as express from "express";
import * as supertest from "supertest";
import { mailgunHandler } from "./mailgun";

test("should register an endpoint", async (done) => {
  const app = express();
  app.post(
    "/inbound/mailgun",
    express.urlencoded({ extended: true }),
    mailgunHandler()
  );

  const response = await supertest(app)
    .post("/inbound/mailgun")
    .send("name=anton&surname=volkov")
    .set("Content-Type", "application/x-www-form-urlencoded");

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ok: true});

  done();
});
