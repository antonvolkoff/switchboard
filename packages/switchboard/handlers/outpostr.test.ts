import * as express from "express";
import outpostrHandler from "./outpostr"
import supertest = require("supertest");

test("should handle RFC2822 message", async (done) => {
  const app = express();
  const middleware = express.json();
  app.post("/inbound/outpostr", middleware, outpostrHandler());

  const message = [
    "From: A <one@example.com>",
    "To: B <two@example.com>",
    "Subject: Hello",
    "",
    "Hello, B!"
  ].join("\r\n");

  const payload = {
    envelope: {
      from: "A <one@example.com>",
      to: ["B <two@example.com>"]
    },
    message: message
  };
  const response = await supertest(app)
    .post("/inbound/outpostr")
    .send(payload);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ok: true});

  done();
});
