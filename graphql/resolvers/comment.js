const Post = require("../../models/Post");
const { checkAuth } = require("../../utils/authHeader");
const { UserInputError, AuthenticationError } = require("apollo-server");
const user = require("./user");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "Comment must not be empty",
          },
        });
      }

      const post = await Post.findOne({ _id: postId });

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else throw new Error("Post not found");
    },
    deleteCommentById: async (_, { postId, commentId }, context) => {
      const { username } = checkAuth(context);
      const post = await Post.findOne({ _id: postId });

      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();

          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else throw new Error("Post not found");
    },
  },
};
