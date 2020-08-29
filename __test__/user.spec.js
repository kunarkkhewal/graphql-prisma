import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabse';
import getClient from './utils/getClient';
import { createUser, getUsers, login, getProfile } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase)

test('Should create a new user', async () => {
    const variables = {
        data: {
            name: "Kunark",
            email: "kunark@example.com",
            password: "redredred"
        }
    }

    const response = await client.mutate({
        mutation: createUser,
        variables
    })

    const exist = await prisma.exists.User({id: response.data.createUser.user.id});
    expect(exist).toBe(true);
});

test('Should expose public author profile', async () => {
    const response = await client.query({query: getUsers});

    expect(response.data.users.length).toBe(2);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe('Jen')
});

test('should not login with bad credentials', async () => {
    const variables = {
        data: {
            email: "fail@example.com",
            password: "fssdcscsecec" 
        }
    }

    await expect(
        client.mutate({mutation: login, variables})
    ).rejects.toThrow();
});

test('should not signup with invalid password', async () => {
    const variables = {
        data: {
            name: "Test",
            email: "test@example.com",
            password: "short"
        }
    }

    await expect(client.mutate({mutation: createUser, variables})).rejects.toThrow();
});

test('should fetch user data', async () => {
    const client = getClient(userOne.jwt);
    const {data} = await client.query({query: getProfile});

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.email).toBe(userOne.user.email)
});