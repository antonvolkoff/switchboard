import * as express from "express";
import * as supertest from "supertest";
import { createTransport } from "nodemailer";
import { Options as MailOptions } from "nodemailer/lib/mailer";
import { mailgunHandler } from "./mailgun";

async function generateTestEmail(mailOptions: MailOptions): Promise<string> {
  const transporter = createTransport({
    streamTransport: true,
    newline: "unix",
    buffer: true,
  });

  const mail = await transporter.sendMail(mailOptions);
  return mail.message.toString();
}

test("should handle RFC2822 message", async (done) => {
  const app = express();
  const middleware = express.urlencoded({ extended: true });
  app.post("/inbound/mailgun.mime", middleware, mailgunHandler());

  const webhookMeta = {
    timestamp: "1578936122",
    token: "438442021526ddf1ca178addfb4e35ea9178d511ae9192c1ad",
    signature: "87390062f5c9601e47ab15e4866626fa6b7d0e96aa0c3ee810aed32fc8c5f55d"
  };
  const envelope = {
    recipient: "test@mail.outpostr.com",
    sender: "choixer@gmail.com",
  }
  const emailContent = await generateTestEmail({
    from: "Anton Volkov <choixer@gmail.com>",
    to: "test@mail.outpostr.com",
    subject: "Test Email",
    text: "Hello, World!",
  });

  const response = await supertest(app)
    .post("/inbound/mailgun.mime")
    .type("form")
    .send(webhookMeta)
    .send(envelope)
    .send({ "body-mime": emailContent });

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ok: true});

  done();
});
