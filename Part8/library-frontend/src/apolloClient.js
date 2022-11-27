import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })
const cache = new InMemoryCache()

const authLink = setContext(({ operationName, variables }, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const apolloClient = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
})

export default apolloClient
