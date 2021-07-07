/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

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

module.exports.getConfig = function getConfig(gql) {
  const config = {
    name: 'Library',
    typeDefs: _getLibraryTypeDef(gql),
    resolvers: _getLibraryResolvers()
  }

  return config
}
