// eslint-disable-next-line import/order
const conf = require('./conf')

const http = require('http')
const express = require('express')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const { ApolloServer } = require('apollo-server-express')
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
  // eslint-disable-next-line no-unused-vars
  ApolloServerPluginDrainHttpServer,
} = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const mongoose = require('mongoose')

const { User } = require('./models')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const { getTokenPayload } = require('./utils')

async function contextHandler({ req }) {
  const payload = getTokenPayload(req?.headers.authorization)

  if (!payload) return

  const { id } = payload
  const user = await User.findById(id)
  if (!user) return

  return { authUser: user }
}

const start = async () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const serverCleanup = useServer({ schema }, wsServer)

  const apolloServer = new ApolloServer({
    schema,
    context: contextHandler,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      // ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        serverWillStart: async () => {
          console.log('serverWillStart')
          return {
            drainServer: async () => {
              console.log('drainServer')
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({
    app,
    path: '/',
  })

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`⭐ Server is now running on http://localhost:${PORT}`)
  )
}

mongoose
  .connect(conf.MONGODB_URL, conf.MONGODB_OPTS)
  .then(() => console.log('⭐ Connection to mongoose established'))
  .catch(e => {
    console.log(e)
    process.exit(1)
  })

mongoose.set('debug', true)

start()
