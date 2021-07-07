const { gql } = require('apollo-server')
const { loadServer } = require('../common')
const { getConfig } = require('./data-definitions')

async function start() {
  const { name, typeDefs, resolvers } = getConfig(gql)
  await loadServer(name, typeDefs, resolvers)
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
