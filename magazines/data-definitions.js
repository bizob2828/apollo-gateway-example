/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

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

module.exports.getConfig = function getConfig(gql) {
  const config = {
    name: 'Magazine',
    typeDefs: _getMagazineTypeDef(gql),
    resolvers: _getMagazineResolvers()
  }

  return config
}
