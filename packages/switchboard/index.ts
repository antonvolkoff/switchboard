import { GraphQLServer, Options } from 'graphql-yoga';
import * as path from 'path';

import Query from './resolvers/query';
import Mailbox from './resolvers/mailbox';

const typeDefs = path.join(__dirname, 'schema.graphql');
const resolvers = { Query, Mailbox };

const server = new GraphQLServer({ typeDefs, resolvers });
const webServerOptions: Options = {
  port: (process.env.PORT || 4000),
};

server.start(webServerOptions);
