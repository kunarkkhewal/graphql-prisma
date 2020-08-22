import { GraphQLServer, PubSub } from 'graphql-yoga';   
import db from './db';
import { resolvers, fragmentReplacements } from './resolvers';
import prisma from './prisma';
import dotenv from 'dotenv';
dotenv.config();

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request) {
        return{
            db,
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements
});

server.start(() => {
    console.log(' ----------- server is up and running');
})