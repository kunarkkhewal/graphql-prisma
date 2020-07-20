import uuidv4 from 'uuid/v4';

const Mutation = {
    createUser(parent, args, { db }, info) {
        let userTaken = db.users.some(user => user.email === args.data.email)

        if(userTaken){
            throw new Error('User Taken')
        }

        const user = {
            id: uuidv4(), 
            ...args.data
        }

        db.users.push(user);

        return user;
    },
    deleteUser(parent, args, { db }, info) {
        let userIndex = db.users.findIndex(user => user.id === args.id);
        if(userIndex === -1) throw new Error("User not found!!!")

        let deletedUsers = db.users.splice(userIndex, 1);

        db.posts = db.posts.filter(post => {
            let match = post.author === args.id

            if(match){
                db.comments = db.comments.filter(comment => comment.post !== post.id)
            }

            return !match
        })

        db.comments = db.comments.filter(comment => comment.author !== args.id)

        return deletedUsers[0]
    },
    updateUser(parent, args, { db }, info) {
        let user = db.users.find(user => user.id === args.id);
        if(!user) throw new Error('User not found')

        if(typeof args.data.email === 'string'){
            let emailTaken = db.users.some(user => user.email === args.data.email)
            if(emailTaken) throw new Error('Email already taken!!!')

            user.email = args.data.email;
        }

        if(typeof args.data.name === 'string'){
            user.name = args.data.name
        }

        if(typeof args.data.age !== 'undefined'){
            user.age = args.data.age
        }

        return user;
    },
    createPost(parent, args, { db, pubsub }, info) {
        let userExist = db.users.some(user => user.id === args.data.author)

        if(!userExist){
            throw new Error('User not Exist')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post);

        if(args.data.published){
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }

        return post;
    },
    deletePost(parent, args, { db, pubsub }, info) {
        let postIndex = db.posts.findIndex(post => post.id === args.id)
        if(postIndex === -1) throw new Error('Post not Found')

        let [post] = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter(comment => comment.post !== args.id);

        if(post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }
        return post;
    },
    updatePost(parent, args, { db, pubsub }, info) {
        let post = db.posts.find(post => post.id === args.id);
        let originalPost = { ...post };

        if(!post) throw new Error('Post not found!!!')

        if(typeof args.data.title === 'string'){
            post.title = args.data.title
        }

        if(typeof args.data.body === 'string'){
            post.body = args.data.body
        }

        if(typeof args.data.published === 'boolean'){
            post.published = args.data.published

            if(originalPost.published && !post.published){
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if(!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if(post.published){
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post;
    },
    createComment(parent, args, { db, pubsub }, info) {
        let userExist = db.users.some(user => {
            return user.id === args.data.author
        })
        let postExist;
        db.posts.filter(post => {
            if(post.id === args.data.post) postExist = post;
        })

        if(!userExist) {
            throw new Error('User not Exist')
        }

        if(!postExist){
            throw new Error('Post not Exist')
        } else {
            if(!postExist.published) {
                throw new Error('Post not Published')
            }
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment);

        pubsub.publish(`comment-${args.data.post}`, {
            comment:{
                mutation: 'CREATED',
                data: comment
            }
        })

        return comment;
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        let commentIndex = db.comments.findIndex(comment => comment.id === args.id)
        if(commentIndex === -1) throw new Error('Comment not Found')

        let [comment] = db.comments.splice(commentIndex, 1);
        
        pubsub.publish(`comment-${comment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: comment
            }
        })

        return comment;
    },
    updateComment(parent, args, { db, pubsub }, info) {
        let comment = db.comments.find(comment => comment.id === args.id);
        if(!comment) throw new Error("Comment not Found!!!");

        if(typeof args.data.text === 'string') {
            comment.text = args.data.text
        }

        pubsub.publish(`comment-${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment;
    }
}

export { Mutation as default }