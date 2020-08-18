import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const emailTaken = await prisma.exists.User({ email: args.data.email })
        if(emailTaken){
            throw new Error('EMAIL TAKEN ALREADY!!!');
        }
        
        if(args.data.password.length < 8){
            throw new Error('PASSWORD MUST BE 8 CHARACTER LONG ATLEAST!!!')
        }

        const password = await bcrypt.hash(args.data.password, 10);
        const user = await prisma.mutation.createUser({ 
            data: {
                ...args.data,
                password
            } 
        })

        return {
            user,
            token: jwt.sign({userId: user.id}, process.env.JWT_SECRET)
        }
    },

    async login(parent, args, {prisma}, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })
        if(!user){
            throw new Error('EMAIL NOT FOUND!!!')
        }

        const doesPasswordMatch = await bcrypt.compare(args.data.password, user.password)
        if(!doesPasswordMatch){
            throw new Error('PASSWORD DOES NOT MATCH!!!')
        }

        return {
            user,
            token: jwt.sign({userId: user.id}, process.env.JWT_SECRET)
        }
    },

    async deleteUser(parent, args, { prisma }, info) {
        const userExist = await prisma.exists.User({ id: args.id })

        if(!userExist){
            throw new Error('USER DOES NOT EXIST!!!')
        }

        return prisma.mutation.deleteUser({ 
            where: { id: args.id }
        }, info)
    },

    async updateUser(parent, args, { prisma }, info) {
        let userExist = await prisma.exists.User({ id: args.id })

        if(!userExist){
            throw new Error('USER DOES NOT EXIST!!!')
        }

        return prisma.mutation.updateUser({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },

    async createPost(parent, args, { prisma }, info) {
        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author:{
                    connect:{
                        id: args.data.author
                    }
                }
            }
        }, info)
    },

    async deletePost(parent, args, { prisma }, info) {
        let isPostExists = await prisma.exists.Post({id: args.id})

        if(!isPostExists){
            throw new Error('POST DOES NOT EXISTS!!!')
        }

        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },

    async updatePost(parent, args, { prisma }, info) {
        let isPostExist = await prisma.exists.Post({id: args.id})

        if(!isPostExist){
            throw new Error('POST DOES NOT EXISTS!!!')
        }

        return prisma.mutation.updatePost({
            data: args.data,
            where: {
                id: args.id
            }
        }, info)
    },

    async createComment(parent, args, { prisma }, info) {
        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: args.data.author
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },

    async deleteComment(parent, args, { prisma }, info) {
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },

    async updateComment(parent, args, { prisma }, info) {
        return prisma.mutation.updateComment({
            data: args.data,
            where: {
                id: args.id
            }
        }, info)
    }
}

export { Mutation as default }