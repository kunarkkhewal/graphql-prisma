const Query = {
    users(parent, args, { prisma }, info) {
        const opArgs = {};
        if(args.query){
            opArgs.where = {
                OR:[{
                    name_contains: args.query
                },{
                    email_contains: args.query
                }]
                
            }
        }

        return prisma.query.users(opArgs, info);
    },

    posts(parent, args, { prisma }, info) {
        const opArgs = {};
        if(args.query){
            opArgs.where = {
                OR:[{
                    title_contains: args.query
                },{
                    body_contains: args.query
                }]
            }
        }

        return prisma.query.posts(opArgs, info);
    },

    comments(parent, args, { prisma }, info) {
        return prisma.query.comments(null, info)
    },

    add(parent, args) {
        return args.num1 + args.num2
    },

    me() {
        return {
            id: 'abc123',
            name: 'Prince',
            email: 'example@example.com'
        }
    },

    post() {
        return {
            id: 'abc123',
            title: 'The art of War',
            body: 'this is one post body that you will never read',
            published: true
        }
    }
}

export { Query as default }