import { ApolloProvider } from '@apollo/client'
import apolloClient from '../apolloClient'

import App from './App'

function Root() {
  return (
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  )
}

export default Root
