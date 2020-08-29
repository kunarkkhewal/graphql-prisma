import { gql } from 'apollo-boost';

const createUser = gql`
    mutation($data: CreateUserInput!){
        createUser(
            data: $data
        ){
            toekn,
            user{
                id
                name
                email
            }
        }
    }
`;
const getUsers = gql`
    query{
        users{
            id
            name
            email
        }
    }
`;
const login = gql`
    mutation($data: LoginUserData!){
        login(
            data: $data
        ){
            token
        }
    }
`;
const getProfile = gql`
    query{
        me{
            id
            name
            email
        }
    }
`;
const getPosts = gql`
    query{
        posts{
            id
            title
            published
        }
    }
`;
const myPosts = gql`
    query{
        myPosts{
            id
            title
            body
            published
        }
    }
`;
const updatePost = gql`
    mutation($id: Id!, $data: UpdatePostInput!) {
        updatePost(
            id: $id,
            data: $data
        ){  
            id
            title
            body
            published
        }
    }
`;
const createPost = gql`
    mutation($data: CreatePostInput!) {
        createPost(
            data: $data
        ){  
            id
            title
            body
            published
        }
    }
`;
const deletePost = gql`
    mutation($id: Id!) {
        deletePost(
            id: $id
        ){  
            id
            title
            body
            published
        }
    }
`;
const deleteComment = gql`
    mutation($id: Id!){
        deleteComment(
            id: $id
        ){
            id
        }
    }
`;
const subscribeToComments = gql`
    subscription($postId: Id!) {
        comment(postId: $postId) {
            mutation
            node {
                id
                text
            }
        }
    }
`;
const subscribeToPosts = gql`
    subscription {
        post {
            mutation
        }
    }
`;

export { createUser, getUsers, login, getProfile, getPosts, myPosts, updatePost, createPost, deletePost, deleteComment, subscribeToComments, subscribeToPosts }