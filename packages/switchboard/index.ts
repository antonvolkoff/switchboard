import { GraphQLServer, Options } from "graphql-yoga";
import * as path from "path";
import * as express from "express";

import { configuration } from "./configuration";
import Query from "./resolvers/query";
import Mailbox from "./resolvers/mailbox";
import { mailgunHandler } from "./inbound/mailgun";

const typeDefs = configuration.graphqlSchemaPath;
const resolvers = { Query, Mailbox };

const server = new GraphQLServer({ typeDefs, resolvers });
const formReader = express.urlencoded({ extended: true });

server.express.post("/inbound/mailgun", formReader, mailgunHandler());
server.express.post("/inbound/mailgun.mime", formReader, mailgunHandler());

const webServerOptions: Options = { port: configuration.port };
server.start(webServerOptions);
