import { useApolloClient, useSubscription } from '@apollo/client'
import { useState } from 'react'

import Authors from './Authors'
import Books from './Books'
import NewBook from './NewBook'
import LoginForm from './LoginForm'
import RecommendedBooks from './RecommendedBooks'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, CURRENT_USER } from '../queries'

const PAGES = {
  AUTHORS: 'Authors',
  BOOKS: 'Books',
  ADD_BOOK: 'AddBook',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  RECOMMENDED_BOOK: 'RecommendedBooks',
}

function handleBookAdded(cache, book) {
  cache.updateQuery({ query: ALL_AUTHORS }, data => {
    if (!data) return data

    const { allAuthors } = data
    if (allAuthors.some(a => a.name === book.author.name)) return data

    return { allAuthors: [...allAuthors, book.author] }
  })

  cache.updateQuery({ query: CURRENT_USER }, data => {
    if (!data || !data.me) return data
    if (!book.genres.includes(data.me.favouriteGenre)) return data

    const { me } = data
    const newMe = { ...me, recommendedBooks: [...me.recommendedBooks, book] }

    return { me: newMe }
  })

  book.genres.forEach(genre => {
    cache.updateQuery({ query: ALL_BOOKS, variables: { genre } }, data => {
      if (!data) return data
      console.log(`genre=${genre} => len = ${data.allBooks.length}`)
      return { allBooks: [...data.allBooks, book] }
    })
  })

  cache.updateQuery({ query: ALL_BOOKS, variables: { genre: null } }, data => {
    if (!data) return data
    console.log(`genre=null => len = ${data.allBooks.length}`)
    return { allBooks: [...data.allBooks, book] }
  })
}

function useBookAdded() {
  useSubscription(BOOK_ADDED, {
    onData: ({ data: msg, client }) => {
      const book = msg.data.bookAdded

      console.log(`⚡ BookAdded: ${book.title} by ${book.author.name}`)
      // eslint-disable-next-line no-alert
      alert(`⚡ BookAdded: ${book.title} by ${book.author.name}`)

      handleBookAdded(client.cache, book)
    },
  })
}

function App() {
  const apolloClient = useApolloClient()
  useBookAdded()
  const [page, setPage] = useState(PAGES.BOOKS)
  const [token, setToken] = useState(null)

  const loggedIn = Boolean(token)

  const onAuthentication = authToken => {
    setToken(authToken)
    localStorage.setItem('token', authToken)
    setPage(PAGES.AUTHORS)
  }

  const handleLogout = async () => {
    setToken(null)
    localStorage.removeItem('token')
    setPage(PAGES.AUTHORS)
    await apolloClient.resetStore()
  }

  const switchTo = page => () => setPage(page)

  return (
    <div>
      <div>
        <button onClick={switchTo(PAGES.AUTHORS)}> authors </button>
        <button onClick={switchTo(PAGES.BOOKS)}> books </button>
        {!loggedIn && <button onClick={switchTo(PAGES.LOGIN)}> login </button>}

        {loggedIn && <button onClick={switchTo(PAGES.ADD_BOOK)}> add book </button>}
        {loggedIn && (
          <button onClick={switchTo(PAGES.RECOMMENDED_BOOK)}>recommended</button>
        )}
        {loggedIn && <button onClick={handleLogout}> logout </button>}
      </div>

      <hr />

      <Authors show={page === PAGES.AUTHORS} loggedIn={loggedIn} />
      <Books show={page === PAGES.BOOKS} />
      <NewBook show={page === PAGES.ADD_BOOK} />

      <RecommendedBooks
        key={token || 'anonymous'}
        show={page === PAGES.RECOMMENDED_BOOK}
      />

      <LoginForm onAuthentication={onAuthentication} show={page === PAGES.LOGIN} />
    </div>
  )
}

export default App
