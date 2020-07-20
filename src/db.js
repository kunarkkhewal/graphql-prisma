const users = [{
    id: "1",
    name: 'Kunark',
    email: 'kunark@example.com',
    age: 23
},{
    id: "2",
    name: 'Nikki',
    email: 'nikki@example.com',
    age: 19
},{
    id: "3",
    name: 'Sangito',
    email: 'sangito@example.com',
    age: 46
}]

const posts = [{
    id: "11",
    title: 'Test1',
    body: 'testing post',
    published: false,
    author: '1'
},
{
    id: "12",
    title: 'Test2',
    body: 'te post',
    published: true,
    author: '1'
},
{
    id: "13",
    title: 'Tes1',
    body: 'testing post',
    published: true,
    author: '2'
},
{
    id: "14",
    title: 'Tes1',
    body: 'tesing post',
    published: false,
    author: '3'
}]

const comments = [{
    id: "21",
    text: 'My comment 1',
    author: '1',
    post: '13'
},{
    id: "22",
    text: 'My 2nd comment',
    author: '1',
    post: '12'
},{
    id: "23",
    text: 'My comment 3',
    author: '2',
    post: '11'
},{
    id: "24",
    text: 'My comment 4',
    author: '3',
    post: '14'
}]

const db = {
    users,
    posts,
    comments
}

export { db as default };