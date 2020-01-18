import { GraphQLServer, Options } from "graphql-yoga";
import * as express from "express";

import { configuration } from "./configuration";
import Query from "./resolvers/query";
import Mailbox from "./resolvers/mailbox";
import verifyMailgunWebhook from "./handlers/verify-mailgun";
import mailgunHandler from "./handlers/mailgun";
import outpostrHandler from "./handlers/outpostr";

const typeDefs = configuration.graphqlSchemaPath;
const resolvers = { Query, Mailbox };

const server = new GraphQLServer({ typeDefs, resolvers });

server.express.post(
  "/inbound/mailgun.mime",
  [
    express.urlencoded({ limit: configuration.bodySizeLimit, extended: true }),
    verifyMailgunWebhook(configuration.mailgun.webhookSigningKey),
    mailgunHandler(),
  ]
);
server.express.post(
  "/inbound/outpostr",
  [
    express.json({ limit: configuration.bodySizeLimit }),
    outpostrHandler()
  ]
);

const webServerOptions: Options = { port: configuration.port };
server.start(webServerOptions);
