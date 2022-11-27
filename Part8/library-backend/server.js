// eslint-disable-next-line import/order
const conf = require('./conf')

const { gql, ApolloServer } = require('apollo-server')
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
  AuthenticationError,
  UserInputError,
} = require('apollo-server-core')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const { Book, Author, User } = require('./models')
const { getTokenPayload } = require('./utils')

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    favouriteGenre: String!
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
`

const resolvers = {
  Author: {
    bookCount: async author => {
      return Book.find({ author: author.id }).countDocuments()
    },
  },

  Query: {
    me: (root, args, { authUser }) => authUser,
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, { author = null, genre = null }) => {
      let books = Book.find({})

      if (genre !== null) books = books.find({ genres: { $all: [genre] } })
      if (author !== null) {
        const refAuthor = await Author.findOne({ name: author }).select({
          id: true,
        })
        books = books.where('author').equals(refAuthor)
      }

      return books.populate('author')
    },
    allAuthors: async () => Author.find({}),
  },

  Mutation: {
    createUser: async (root, args) => {
      const user = new User(args)
      try {
        await user.save()
      } catch (e) {
        throw new UserInputError(e.message, { invalidArgs: args })
      }
      console.log(args)
      return user
    },

    login: async (root, args) => {
      const error = new UserInputError('invalid credentials', { invalidArgs: args })

      const { username, password } = args

      if (password !== conf.LOGIN_PASSWORD) throw error

      const user = await User.findOne({ username })

      if (!user) throw error

      const jwtPayload = { id: user.id.toString(), username: user.username }
      const token = jwt.sign(jwtPayload, conf.JWT_SECRET_KEY)

      return { value: token }
    },

    addBook: async (root, args, { authUser }) => {
      if (!authUser) throw new AuthenticationError('not authenticated')

      let author = await Author.findOne({ name: args.author })

      const isNewAuthor = !author
      let book = null

      try {
        if (!author) author = await Author.create({ name: args.author })

        book = await Book.create({ ...args, author })
      } catch (e) {
        if (isNewAuthor && author) await author.delete()
        throw new UserInputError(e.message, { invalidArgs: args })
      }

      return book
    },

    editAuthor: async (root, { name, setBornTo }, { authUser }) => {
      if (!authUser) throw new AuthenticationError('not authenticated')

      const author = await Author.findOne({ name })

      if (!author) return

      try {
        author.born = setBornTo
        await author.save()
      } catch (e) {
        throw new UserInputError(e.message, { invalidArgs: { name, setBornTo } })
      }

      return author
    },
  },
}

async function contextHandler({ req }) {
  const payload = getTokenPayload(req?.headers.authorization)

  if (!payload) return

  const { id } = payload
  const user = await User.findById(id)

  if (!user) return

  return { authUser: user }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextHandler,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
})

server.listen().then(({ url }) => {
  console.log(`⭐ Apollo server listening at ${url}`)
})

mongoose
  .connect(conf.MONGODB_URL, conf.MONGODB_OPTS)
  .then(() => console.log('⭐ Connection to mongoose established'))
  .catch(e => {
    console.log(e)
    process.exit(1)
  })
mongoose.set('debug', true)
