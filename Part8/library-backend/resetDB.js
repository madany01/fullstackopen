const mongoose = require('mongoose')
const conf = require('./conf')

const { Book, Author, User } = require('./models')

const cmdMode = require.main === module

const users = [{ username: 'ahmad', favouriteGenre: 'design' }]

const authors = [
  {
    name: 'Robert Martin',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
  },
  {
    name: 'Sandi Metz', // birthyear not known
  },
]

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime'],
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'revolution'],
  },
]

const log = (...args) => {
  if (!cmdMode) return
  console.log(...args)
}

async function deleteBooks() {
  log('deleting books ..')
  await Book.deleteMany({})
}

async function deleteAuthors() {
  log('deleting authors ..')
  await Author.deleteMany({})
}

async function createAuthors() {
  log('creating authors ..')
  return Promise.all(authors.map(a => Author.create(a)))
}

async function createBooks() {
  log('creating books ..')
  const authors = await Author.find({})

  const authorsByName = Object.fromEntries(authors.map(a => [a.name, a]))

  return Promise.all(
    books.map(b => Book.create({ ...b, author: authorsByName[b.author] }))
  )
}

async function deleteUsers() {
  log('deleting users ..')
  await User.deleteMany({})
}

async function createUsers() {
  log('creating users ..')
  return Promise.all(users.map(u => User.create(u)))
}

async function resetAll() {
  log('resetting all ..')
  await deleteBooks()
  await deleteAuthors()

  await createAuthors()
  await createBooks()

  await deleteUsers()
  await createUsers()
}

async function main() {
  await mongoose.connect(conf.MONGODB_URL, conf.MONGODB_OPTS)
  const jobs = []

  if (process.argv.includes('--all')) {
    jobs.push(resetAll)
  } else {
    if (process.argv.includes('--books')) jobs.push(deleteBooks, createBooks)
    if (process.argv.includes('--authors')) jobs.push(deleteAuthors, createAuthors)
    if (process.argv.includes('--users')) jobs.push(deleteUsers, createUsers)
  }

  // eslint-disable-next-line no-restricted-syntax, no-await-in-loop
  for (const job of jobs) await job()

  await mongoose.disconnect()
}

if (cmdMode) main()

module.exports = { deleteAuthors }
