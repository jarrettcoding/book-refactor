const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Books]
  }

  type Book {
    _id: ID
    authors: String
    description: String
    bookId: String
    image: String
    title: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    createUser(username: String!, password: String!, email: String!): Auth
    login(username: String!, password: String!): Auth
    saveBook(
      authors: String!
      description: String!
      bookId: String!
      image: String!
      title: String!
    ): User
    deleteBook(bookId: String!): User
  }
`;
