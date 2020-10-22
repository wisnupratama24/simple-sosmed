const postResolvers = require("./post");
const userResolvers = require("./user");
const commentResolvers = require("./comment");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...commentResolvers.Mutation,
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
  },
};
