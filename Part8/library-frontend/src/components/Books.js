import { useState } from 'react'

import { useQuery } from '@apollo/client'
import GenresList from './GenresList'
import BookTable from './BookTable'
import { ALL_BOOKS } from '../queries'

const ALL_GENRES = 'all genres'

function Books({ show }) {
  const [selectedGenre, setSelectedGenre] = useState(ALL_GENRES)
  const [genres, setGenres] = useState([])

  const { data, loading, error } = useQuery(ALL_BOOKS, {
    variables: { ...(selectedGenre !== ALL_GENRES && { genre: selectedGenre }) },
    skip: !show,
    onCompleted: data => {
      if (
        selectedGenre !== ALL_GENRES ||
        (genres.length && genres.length === data.allBooks.length)
      )
        return
      const books = data.allBooks

      setGenres([
        ...new Set(
          books.reduce(
            (arr, book) => {
              arr.push(...book.genres)
              return arr
            },
            [ALL_GENRES]
          )
        ),
      ])
    },
  })

  if (!show) return null

  const filteredBooks = data?.allBooks

  const handleGenreSelect = genre => {
    setSelectedGenre(genre)
  }

  return (
    <div>
      {loading && <p> Loading .. </p>}
      {error && <h3> Error: {error.message} </h3>}
      {data && (
        <>
          <BookTable books={filteredBooks} />
          <GenresList genres={genres} onSelect={handleGenreSelect} />
        </>
      )}
    </div>
  )
}

export default Books
