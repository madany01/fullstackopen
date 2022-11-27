import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    published
    genres
    author {
      name
    }
  }
`

const BOOK_DETAILS_EXTENDED_AUTHOR = gql`
  fragment BookDetailsExtendedAuthor on Book {
    id
    title
    published
    genres
    author {
      id
      name
      born
      bookCount
    }
  }
`

const ALL_AUTHORS = gql`
  query allAuthors {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`

const ALL_BOOKS = gql`
  query allBooks($genre: String = null) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`

const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $published: Int!
    $genres: [String!]!
    $author: String!
  ) {
    addBook(
      title: $title
      published: $published
      genres: $genres
      author: $author
    ) {
      ...BookDetailsExtendedAuthor
    }
  }

  ${BOOK_DETAILS_EXTENDED_AUTHOR}
`

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      id
      name
      born
      bookCount
    }
  }
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

const CURRENT_USER = gql`
  query currentUser {
    me {
      id
      username
      favouriteGenre
      recommendedBooks {
        ...BookDetails
      }
    }
  }

  ${BOOK_DETAILS}
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetailsExtendedAuthor
    }
  }
  ${BOOK_DETAILS_EXTENDED_AUTHOR}
`

export {
  ALL_AUTHORS,
  ALL_BOOKS,
  ADD_BOOK,
  EDIT_AUTHOR,
  LOGIN,
  CURRENT_USER,
  BOOK_ADDED,
}
