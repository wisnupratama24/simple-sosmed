const { gql } = require("apollo-server");

module.exports = gql`
  type Comments {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }
  type Likes {
    id: ID!
    username: String!
    createdAt: String!
  }
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comments]!
    likes: [Likes]!
    likeCount: Int!
    commentCount: Int!
  }
  input RegisterUser {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type User {
    id: ID!
    username: String!
    token: String!
    email: String!
    createdAt: String!
  }
  type Query {
    getAllPost: [Post]
    getPostById(postId: ID!): Post
  }
  type Mutation {
    registerUser(registerUser: RegisterUser): User!
    loginUser(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePostById(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post
    deleteCommentById(postId: String!, commentId: String!): Post
    likePost(postId: ID!): Post
  }
`;
