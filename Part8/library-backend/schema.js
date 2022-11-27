const { gql } = require('apollo-server')

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    favouriteGenre: String!
    recommendedBooks: [Book!]!
  }

  type Token {
    value: String!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type Book {
    id: ID!
    title: String!
    published: Int!
    genres: [String!]!
    author: Author!
  }

  type Query {
    me: User

    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    createUser(username: String!, favouriteGenre: String!): User

    login(username: String!, password: String!): Token

    addBook(
      title: String!
      published: Int!
      genres: [String!]!
      author: String!
    ): Book!

    editAuthor(name: String!, setBornTo: Int!): Author
  }

  type Subscription {
    bookAdded: Book!
  }
`

module.exports = typeDefs
