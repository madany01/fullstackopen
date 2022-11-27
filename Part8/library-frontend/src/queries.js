import { gql } from '@apollo/client'

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`

const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      published
      author
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
console.log(EDIT_AUTHOR)
export { ALL_AUTHORS, ALL_BOOKS, ADD_BOOK, EDIT_AUTHOR }
