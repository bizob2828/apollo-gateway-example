/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

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

module.exports.getConfig = function getConfig(gql) {
  const config = {
    name: 'Book',
    typeDefs: _getBookTypeDef(gql),
    resolvers: _getBookResolvers()
  }

  return config
}

