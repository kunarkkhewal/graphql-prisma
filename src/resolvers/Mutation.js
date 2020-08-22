import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';

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

    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        return prisma.mutation.deleteUser({ 
            where: { id: userId }
        }, info)
    },

    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)
    },

    async createPost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author:{
                    connect:{
                        id: userId
                    }
                }
            }
        }, info)
    },

    async deletePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        const isPostExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if(!isPostExists){
            throw new Error('OPERATION FAILED!!!')
        }

        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },

    async updatePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        const isPostExist = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })
        const isPostPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        })

        if(!isPostExist){
            throw new Error('OPERATION FAILED!!!')
        }



        if(isPostPublished && args.data.published === false){
            await prisma.mutation.deleteManyComments({
                post: {
                    id: args.id
                }
            })
        }

        return prisma.mutation.updatePost({
            data: args.data,
            where: {
                id: args.id
            }
        }, info)
    },

    async createComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        const isPostPublished = await prisma.exists.Post({
            id: args.data.post,
            published: true 
        })
        if(!isPostPublished){
            throw new Error('OPERATION FAILED!!!')
        }
        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
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

    async deleteComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        let isComment = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })
        if(!isComment){
            throw new Error('OPERATION FAILED!!!')
        }

        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },

    async updateComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        let isComment = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })
        if(!isComment){
            throw new Error('OPERATION FAILED!!!')
        }
        
        return prisma.mutation.updateComment({
            data: args.data,
            where: {
                id: args.id
            }
        }, info)
    }
}

export { Mutation as default }