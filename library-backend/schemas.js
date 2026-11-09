
const typeDefs = /* GraphQL */ `

  # === user management ===

  type User {
    id: ID!
    username: String!
    favoriteGenre: String!
  }

  type Token {
    value: String!
  }

  # === library ===
  
  type Book {
    id: ID!
    title: String!
    published: Int! 
    author: Author!
    genres: [String!]!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  # === base ===

  type Query {
    # user management
    me: User

    # library
    bookCount: Int!
    authorCount: Int!

    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    # user management
    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token

    # library
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
