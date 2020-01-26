import { GraphQLServer, Options } from "graphql-yoga";
import * as express from "express";
import * as Sentry from "@sentry/node";

import { configuration } from "./configuration";
import Query from "./resolvers/query";
import Mailbox from "./resolvers/mailbox";
import verifyMailgunWebhook from "./handlers/verify-mailgun";
import mailgunHandler from "./handlers/mailgun";
import outpostrHandler from "./handlers/outpostr";
import MailBus from "./mail-bus";
import * as SendToOutpostr from "./listeners/send-to-outpostr";
import * as SendToMailgun from "./listeners/send-to-mailgun";

Sentry.init({ dsn: configuration.sentryDsn });

const mailBus = new MailBus();
mailBus.on(SendToOutpostr.eventName, SendToOutpostr.listener);
mailBus.on(SendToMailgun.eventName, SendToMailgun.listener);

const typeDefs = configuration.graphqlSchemaPath;
const resolvers = { Query, Mailbox };
const server = new GraphQLServer({ typeDefs, resolvers });
const app = server.express;

app.use(Sentry.Handlers.requestHandler());

app.post(
  "/inbound/mailgun.mime",
  [
    express.urlencoded({ limit: configuration.bodySizeLimit, extended: true }),
    verifyMailgunWebhook(configuration.mailgun.webhookSigningKey),
    mailgunHandler(mailBus),
  ]
);
app.post(
  "/inbound/outpostr",
  [
    express.json({ limit: configuration.bodySizeLimit }),
    outpostrHandler(mailBus),
  ]
);

app.use(Sentry.Handlers.errorHandler());

const webServerOptions: Options = { port: configuration.port };
server.start(webServerOptions);
