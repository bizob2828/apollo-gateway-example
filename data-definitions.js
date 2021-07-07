/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'


/* --- Example Query ---
query MyQuery {
  libraries {
    branch
    booksInStock {
      isbn,
      title,
      author
    }
    magazinesInStock {
      issue,
      title
    }
  }
}
*/

const libraries = [
  {
    id: '1',
    branch: 'downtown'
  },
  {
    id: '2',
    branch: 'riverside'
  },
  {
    id: '3',
    branch: 'northwest crossing'
  },
  {
    id: '4',
    branch: 'east'
  }
]

function _getLibraryTypeDef(gql) {
  const typeDefs = gql`
    type Library @key(fields: "id") {
      id: ID!
      branch: String
    }

    extend type Query {
      library(id: ID!): Library
      libraries: [Library]
    }
    `

  return typeDefs
}

// https://www.apollographql.com/docs/federation/api/apollo-federation/#__resolvereference
function _getLibraryResolvers() {
  const resolvers = {
    Library: {
      __resolveReference(reference) {
        return libraries.find((library) => library.id === reference.id);
      }
    },
    Query: {
      library(_, { id }) {
        return libraries.find((library) => library.id === id);
      },
      libraries() {
        return libraries;
      }
    }
  }

  return resolvers
}

const books = [
  {
    title: 'Node Agent: The Book',
    isbn: 'a-fake-isbn',
    author: 'Sentient Bits',
    branch: '2'
  },
  {
    title: 'Ollies for O11y: A Sk8er\'s Guide to Observability',
    isbn: 'a-second-fake-isbn',
    author: 'Faux Hawk',
    branch: '1'
  },
  {
    title: '[Redacted]',
    isbn: 'a-third-fake-isbn',
    author: 'Closed Telemetry',
    branch: '2'
  },
  {
    title: 'Be a hero: fixing the things you broke',
    isbn: 'a-fourth-fake-isbn',
    author: '10x Developer',
    branch: '1'
  }
]

function _getBookTypeDef(gql) {
  const typeDefs = gql`
    type Book {
      isbn: ID!
      title: String
      author: String
      branch: Library
    }

    extend type Library @key(fields: "id") {
      id: ID! @external
      booksInStock: [Book]
    }

    extend type Query {
      book(isbn: ID!): Book
      books: [Book]
    }
  `
  return typeDefs
}

function _getBookResolvers() {
  const resolvers = {
    Book: {
      branch(parent) {
        return { __typename: 'Library', id: parent.branch }
      }
      // actors(film) {
      //   return film.actors.map((actor) => ({ __typename: "Person", id: actor }));
      // }
    },
    Library: {
      booksInStock(parent) {
        return books.filter((book) => book.branch === parent.id)
      }
    },
    Query: {
      book(_, { isbn }) {
        return books.find((book) => book.isbn === isbn);
      },
      books() {
        return books;
      }
    }
  }

  return resolvers
}

const magazines = [
  {
    title: 'Reli Updates Weekly',
    issue: 1,
    branch: '2'
  },
  {
    title: 'Reli Updates Weekly',
    issue: 2,
    branch: '1'
  }
]

function _getMagazineTypeDef(gql) {
  const typeDefs = gql`
    type Magazine {
      issue: ID!
      title: String
      branch: Library
    }

    extend type Library @key(fields: "id") {
      id: ID! @external
      magazinesInStock: [Magazine]
    }

    extend type Query {
      magazine(issue: ID!): Magazine
      magazines: [Magazine]
    }
  `

  return typeDefs
}

function _getMagazineResolvers() {
  const resolvers = {
    Magazine: {
      branch(parent) {
        return { __typename: 'Library', id: parent.branch }
      }
      // actors(film) {
      //   return film.actors.map((actor) => ({ __typename: "Person", id: actor }));
      // }
    },
    Library: {
      magazinesInStock(parent) {
        return magazines.filter((magazine) => magazine.branch === parent.id)
      }
    },
    Query: {
      magazine(_, { issue }) {
        return magazines.find((magazine) => magazine.issue === issue);
      },
      magazines() {
        return magazines;
      }
    }
  }

  return resolvers
}

function getLibraryConfiguration(gql) {
  const config = {
    name: 'Library',
    typeDefs: _getLibraryTypeDef(gql),
    resolvers: _getLibraryResolvers()
  }

  return config
}

function getBookConfiguration(gql) {
  const config = {
    name: 'Book',
    typeDefs: _getBookTypeDef(gql),
    resolvers: _getBookResolvers()
  }

  return config
}

function getMagazineConfiguration(gql) {
  const config = {
    name: 'Magazine',
    typeDefs: _getMagazineTypeDef(gql),
    resolvers: _getMagazineResolvers()
  }

  return config
}

module.exports = {
  getLibraryConfiguration,
  getBookConfiguration,
  getMagazineConfiguration
}
