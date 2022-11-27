require('dotenv').config()

const MONGODB_URL = 'mongodb://localhost:27017/graphql_library_backend'

const MONGODB_OPTS = { useUnifiedTopology: true, useNewUrlParser: true }

const LOGIN_PASSWORD = 'secret123'

const JWT_SECRET_KEY = 'secret123'

const conf = {
  MONGODB_URL,
  MONGODB_OPTS,
  LOGIN_PASSWORD,
  JWT_SECRET_KEY,
}

module.exports = conf
