import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, CURRENT_USER } from '../queries'

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('test')
  const [author, setAuthor] = useState('test')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('design')
  const [genres, setGenres] = useState([])

  const [addBook, { loading, error }] = useMutation(ADD_BOOK)

  if (!show) return null

  const submit = async event => {
    event.preventDefault()

    addBook({
      variables: { title, published: Number(published), genres, author },

      update: (cache, response) => {
        const book = response.data.addBook

        const booksUpdater = data => {
          if (!data) return data
          return { allBooks: [...data.allBooks, book] }
        }

        ;[...genres, null, undefined].forEach(genre =>
          cache.updateQuery(
            {
              query: ALL_BOOKS,
              ...(genre !== undefined && { variables: { genre } }),
            },
            booksUpdater
          )
        )

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
      },

      onError: e => console.error(e),
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres([...genres, genre])
    setGenre('')
  }

  return (
    <div>
      {error && <p>{error.message}</p>}
      <form>
        <div>
          title
          <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type='submit' onClick={submit} disabled={loading}>
          create book
        </button>
      </form>
    </div>
  )
}

export default NewBook
