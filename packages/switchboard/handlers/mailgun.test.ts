import * as express from "express";
import * as supertest from "supertest";
import mailgunHandler from "./mailgun";
import MailBus from "../mail-bus";

test("should handle RFC2822 message", async (done) => {
  const mailBus = new MailBus();
  const app = express();
  const middleware = express.urlencoded({ extended: true });
  app.post("/inbound/mailgun.mime", middleware, mailgunHandler(mailBus));

  const envelope = {
    recipient: "test@mail.outpostr.com",
    sender: "choixer@gmail.com",
  }
  const message = [
    "From: A <one@example.com>",
    "To: B <two@example.com>",
    "Subject: Hello",
    "",
    "Hello, B!"
  ].join("\r\n");

  const response = await supertest(app)
    .post("/inbound/mailgun.mime")
    .type("form")
    .send(envelope)
    .send({ "body-mime": message });

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ok: true});

  expect(mailBus.history.length).toEqual(1);
  expect(mailBus.history[0]).toEqual({
    mail_from: "choixer@gmail.com",
    rcpt_to: ["test@mail.outpostr.com"],
    data: message,
  });

  done();
});
