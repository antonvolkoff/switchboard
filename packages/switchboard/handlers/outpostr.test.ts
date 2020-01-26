import * as express from "express";
import outpostrHandler from "./outpostr"
import supertest = require("supertest");
import MailBus from "../mail-bus";

const setup = function(): [express.Express, MailBus] {
  const mailBus = new MailBus();
  const app = express();

  app.post("/inbound/outpostr", express.json(), outpostrHandler(mailBus));

  return [app, mailBus];
}

const message = [
  "From: A <one@example.com>",
  "To: B <two@example.com>",
  "Subject: Hello",
  "",
  "Hello, B!"
].join("\r\n");

test("should return 200 OK response", async (done) => {
  const [app] = setup();

  const payload = {
    mail_from: "A <one@example.com>",
    rcpt_to: ["B <two@example.com>"],
    data: message
  };
  const response = await supertest(app)
    .post("/inbound/outpostr")
    .send(payload);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ok: true});

  done();
});

test("should put message on a mail bus", async (done) => {
  const [app, mailBus] = setup();

  const payload = {
    mail_from: "A <one@example.com>",
    rcpt_to: ["B <two@example.com>"],
    data: message
  };
  await supertest(app).post("/inbound/outpostr").send(payload);

  expect(mailBus.history.length).toEqual(1);
  expect(mailBus.history[0]).toEqual({
    mail_from: payload.mail_from,
    rcpt_to: payload.rcpt_to,
    data: message,
  });

  done();
});