import { ApolloClient, InMemoryCache } from '@apollo/client'

const uri = 'http://localhost:4000'
const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  cache,
  uri,
})

export default apolloClient
