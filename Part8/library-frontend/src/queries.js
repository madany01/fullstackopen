import { gql } from '@apollo/client'

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
      id
      title
      published
      genres
      author {
        name
      }
    }
  }
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
  }
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
        id
        title
        published
        genres
        author {
          name
        }
      }
    }
  }
`

export { ALL_AUTHORS, ALL_BOOKS, ADD_BOOK, EDIT_AUTHOR, LOGIN, CURRENT_USER }
