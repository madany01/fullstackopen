// eslint-disable-next-line import/order
const conf = require('./conf')

const { UserInputError, AuthenticationError } = require('apollo-server-core')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')
const { Book, Author, User } = require('./models')

const pubsub = new PubSub()

const resolvers = {
  User: {
    recommendedBooks: async user => {
      const { favouriteGenre } = user
      return Book.find({ genres: { $all: [favouriteGenre] } }).populate('author')
    },
  },

  Author: {
    bookCount: async author => {
      if ('bookCount' in author) return author.bookCount

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
    allAuthors: async (_, _2, _3, info) => {
      const fields = info.fieldNodes[0]?.selectionSet.selections.map(
        ({ name: { value } }) => value
      )

      if (!fields.includes('bookCount')) return Author.find({})

      const [books, authors] = await Promise.all([Book.find({}), Author.find({})])

      const authorBooksCount = books
        .map(book => book.author.toString())
        .reduce((acc, bookAuthorId) => {
          acc[bookAuthorId] = (acc[bookAuthorId] ?? 0) + 1
          return acc
        }, {})

      authors.forEach(
        // eslint-disable-next-line no-param-reassign
        author => (author.bookCount = authorBooksCount[author.id.toString()] ?? 0)
      )

      return authors
    },
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

      pubsub.publish('BOOK_ADDED', { bookAdded: book })
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

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
