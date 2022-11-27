const { gql, ApolloServer } = require('apollo-server')
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
  UserInputError,
} = require('apollo-server-core')

const { genId } = require('./utils')

const authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
]

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
]

const typeDefs = gql`
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
    author: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      genres: [String!]!
      author: String!
    ): Book!

    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Author: {
    bookCount: root => {
      if ('bookCount' in root) return root
      return books.reduce((acc, book) => acc + (book.author === root.name), 0)
    },
  },

  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, { author = null, genre = null }) => {
      if (author === null && genre === null) return books

      return books.filter(
        b =>
          (author === null ? true : b.author === author) &&
          (genre === null ? true : b.genres.includes(genre))
      )
    },
    allAuthors: () => authors,
  },

  Mutation: {
    addBook: (root, args) => {
      if (books.some(b => b.title === args.title))
        throw new UserInputError('book title must be unique', {
          invalidArgs: [args.title],
        })

      const authorExists = authors.some(a => a.name === args.author)

      if (!authorExists) authors.push({ id: genId(), name: args.author })

      const book = { id: genId(), ...args }
      books.push(book)

      return book
    },
    editAuthor: (root, { name, setBornTo }) => {
      const author = authors.find(a => a.name === name)

      if (!author) return

      author.born = setBornTo

      return author
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
})

server.listen().then(({ url }) => {
  console.log(`⭐ Apollo server listening at ${url}`)
})
