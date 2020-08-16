import { Prisma } from 'prisma-binding';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
    secret: process.env.SECRET
})

export { prisma as default }

// const createPostForUser = async (authorId, data) => {
//     const isUserExist = await prisma.exists.User({
//         id: authorId
//     })

//     if(!isUserExist){
//         throw new Error('User Does not Exist!!!')
//     }

//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{ author { id name email posts { id title published } } }');

//     return post.author;
// }

// // createPostForUser('ckcnenfci00gs07790la87pcs', {
// //     title: 'nice to read book',
// //     body: 'the art of war',
// //     published: true
// // }).then((user) => {
// //     console.log(' ----- users data => ', JSON.stringify(user, undefined, 2))
// // }).catch((error) => {
// //     console.log(' ------ user error => ', error.message)
// // })

// const updatePostForUser = async (postId, data) => {
//     const doesPostExist = await prisma.exists.Post({id: postId});

//     if(!doesPostExist){
//         throw new Error('POST DOES NOT EXIST!!!')
//     }

//     const post = await prisma.mutation.updatePost({
//         where: {
//             id: postId
//         },
//         data: {
//             ...data
//         }
//     }, '{ author { id name email posts { id title published } } }');
    
//     return post.author;
// }

// // updatePostForUser('098', {published: false}).then((data) => {
// //     console.log(" ---------- update post data => ", JSON.stringify(data, undefined, 2))
// // }).catch((error) => {
// //     console.log(error.message);
// // })

// // prisma.mutation.createPost({
// //     data: {
// //         title: 'new post graphql 101',
// //         body: '',
// //         published: false,
// //         author: {
// //             connect: {
// //                 id: 'ckc3lvndj00id0779l12mwu0m'
// //             }
// //         }
// //     }
// // }, '{ id, title, body published author{ id name } }').then((data) => {
// //     console.log(" post data => ", JSON.stringify(data, undefined, 2))
// //     return prisma.query.posts(null, '{ id title body published }')
// // }).then((data) => {
// //     console.log(" -------------- data => ", JSON.stringify(data, undefined, 2));
// // })

// // prisma.mutation.updatePost({
// //     where: {
// //         id: 'ckcodpfvn00oj0779ice0mc22'
// //     },
// //     data: {
// //         published: true,
// //     }
// // }, '{ id, title, body published author{ id name } }').then((data) => {
// //     console.log(" post data => ", JSON.stringify(data, undefined, 2))
// //     return prisma.query.posts(null, '{ id title body published }')
// // }).then((data) => {
// //     console.log(" -------------- data => ", JSON.stringify(data, undefined, 2));
// // })