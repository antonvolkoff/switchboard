import { GraphQLServer, Options } from "graphql-yoga";
import * as path from "path";
import * as express from "express";

import { configuration } from "./configuration";
import Query from "./resolvers/query";
import Mailbox from "./resolvers/mailbox";
import { outboundHandler, inboundHandler } from "./handlers/mailgun";

const typeDefs = configuration.graphqlSchemaPath;
const resolvers = { Query, Mailbox };

const server = new GraphQLServer({ typeDefs, resolvers });
const formReader = express.urlencoded({ extended: true });
const jsonReader = express.json();

server.express.post("/inbound/mailgun", formReader, inboundHandler());
server.express.post("/inbound/mailgun.mime", formReader, inboundHandler());

server.express.post("/outbound/mailgun", jsonReader, outboundHandler());

const webServerOptions: Options = { port: configuration.port };
server.start(webServerOptions);
