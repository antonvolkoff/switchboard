import { GraphQLServer, Options } from "graphql-yoga";
import * as express from "express";

import { configuration } from "./configuration";
import Query from "./resolvers/query";
import Mailbox from "./resolvers/mailbox";
import mailgunHandler from "./handlers/mailgun";
import outpostrHandler from "./handlers/outpostr";

const typeDefs = configuration.graphqlSchemaPath;
const resolvers = { Query, Mailbox };

const server = new GraphQLServer({ typeDefs, resolvers });
const formReader = express.urlencoded({ extended: true });
const jsonReader = express.json();

server.express.post("/inbound/mailgun.mime", formReader, mailgunHandler());
server.express.post("/inbound/outpostr", jsonReader, outpostrHandler());

const webServerOptions: Options = { port: configuration.port };
server.start(webServerOptions);
