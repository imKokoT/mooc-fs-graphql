
const typeDefs = /* GraphQL */ `
  type Book {
    id: ID!
    title: String!
    published: Int! 
    author: String!
    genres: [String!]!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!

    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook (
      title: String!
      published: Int! 
      author: String!
      genres: [String!]!
    ) : Book

    editAuthor (
      name: String!
      setBornTo: Int
    ) : Author
  }
`

module.exports = typeDefs
