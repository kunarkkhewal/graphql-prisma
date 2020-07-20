const Query = {
    users(parent, args, { db }, info) {
        return db.users;
    },
    posts(parent, args, { db }, info) {
        if(!args.query)
            return db.posts;
        return db.posts.filter(post => {
            return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    comments(parent, args, { db }, info) {
        return db.comments
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