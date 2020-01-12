import { GraphQLServer, Options } from "graphql-yoga";
import * as path from "path";
import * as express from "express";

import Query from "./resolvers/query";
import Mailbox from "./resolvers/mailbox";
import { mailgunHandler } from "./inbound/mailgun";

const typeDefs = path.join(__dirname, "schema.graphql");
const resolvers = { Query, Mailbox };

const server = new GraphQLServer({ typeDefs, resolvers });
const formReader = express.urlencoded({ extended: true });

server.express.post("/inbound/mailgun", formReader, mailgunHandler());
server.express.post("/inbound/mailgun.mime", formReader, mailgunHandler());

const webServerOptions: Options = {
  port: (process.env.PORT || 4000),
};
server.start(webServerOptions);
