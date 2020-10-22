const Post = require("../../models/Post");
const { checkAuth } = require("../../utils/authHeader");
const { AuthenticationError } = require("apollo-server");
const user = require("./user");

module.exports = {
  Query: {
    async getAllPost() {
      try {
        const post = await Post.find().sort({ createdAt: -1 });
        return post;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPostById(_, { postid }) {
      try {
        const post = await Post.findOne({ id: postid });
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);
      const newPost = new Post({
        body: body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      return post;
    },
    async deletePostById(_, { postId }, context) {
      const user = checkAuth(context);
      console.log(user);
      try {
        const post = await Post.findOne({ _id: postId });
        console.log(post);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted succesfuly";
        } else {
          throw new AuthenticationError("Access not allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);
      const post = await Post.findOne({ _id: postId });
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else throw new Error("Post not found");
    },
  },
};
