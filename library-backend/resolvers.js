const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')


let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
]


const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,

    allBooks: (root, args) => {
      var out = books

      if (args.author)
        out = out.filter(b => b.author === args.author)
      if (args.genre)
        out = out.filter(b => b.genres.includes(args.genre))

      return out
    },
    allAuthors: () => authors
  },

  Mutation: {
    addBook: (root, {title, published, author, genres}) => {
      // verify
      if (books.find(b => b.title === title))
        throw new GraphQLError(`title must be unique: ${title}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: title
          }
        })

      // register the author if not exists
      if (!authors.find(a => a.name === author)) {
        const newAuthor = {
          name: author,
          id: uuid()
        }
       
        authors = [...authors, newAuthor]
      }

      const newBook = {
        title,
        published,
        author,
        genres,
        id: uuid()
      }

      books = [...books, newBook]
      return newBook
    },

    editAuthor: (root, {name, setBornTo}) => {
      const author = authors.find(a => a.name === name)

      if (!author)
        throw new GraphQLError(`author with name ${name} does not exists`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: name
          }
        })

      // modify fields
      if (setBornTo != null)
        author.born = setBornTo

      return author
    }
  },

  Author: {
    bookCount: (root) => books.filter(b => root.name === b.author).length
  }
}

module.exports = resolvers
