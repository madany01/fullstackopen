import { ApolloProvider } from '@apollo/client'
import { useState } from 'react'

import apolloClient from '../apolloClient'
import Authors from './Authors'
import Books from './Books'
import NewBook from './NewBook'

function App() {
  const [page, setPage] = useState('')
  return (
    <ApolloProvider client={apolloClient}>
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('add')}>add book</button>
        </div>
        <hr />

        <Authors show={page === 'authors'} />

        <Books show={page === 'books'} />

        <NewBook show={page === 'add'} />
      </div>
    </ApolloProvider>
  )
}

export default App
