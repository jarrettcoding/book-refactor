const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks");

        return userData;
      }

      throw new AuthenticationError("You must be logged in");
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { user, token };
    },
    login: async (parent, { username, email, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError(
          "The information you entered is not correct"
        );
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError(
          "The information you entered is not correct"
        );
      }

      const token = signToken(user);
      return { user, token };
    },
    saveBook: async (parent, { body }, context) => {
      if (context.user) {
        const addedBook = await User.findOneandUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { body } } },
          { new: true, runValidators: true }
        );

        return addedBook;
      }

      throw new AuthenticationError("You must be logged in to save books");
    },
    deleteBook: async (parent, { deleteBookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneandUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: deleteBookId } } },
          { new: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError("You must be logged in to delete books");
    },
  },
};

module.exports = resolvers;
