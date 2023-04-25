require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');


const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');


const typeDefs = require('./schema.graphql');
const resolvers = require('./resolvers');

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema: applyMiddleware(schema),
  context: ({ req }) => ({
    ...req,
    prisma,
  }),
});

server.listen().then(({ url }) => {
  console.log(`Server: ${url}`);
});
