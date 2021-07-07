'use strict'

const nrPlugin = require('@newrelic/apollo-server-plugin')

const { ApolloServer, gql } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')
const { ApolloGateway } = require("@apollo/gateway")

const data = require('./data-definitions')

async function loadServers() {
  const libraryService = await loadLibraries()
  const bookService = await loadBooks()
  const magazineService = await loadMagazines()

  await loadGateway(libraryService, bookService, magazineService)
}

loadServers().catch((err) => {
  console.error(err)
  process.exit(1)
})

async function loadGateway(libraryService, bookService, magazineService) {
  const gateway = new ApolloGateway({
    serviceList: [
      libraryService,
      bookService,
      magazineService
    ]
  });

  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    plugins: [ nrPlugin ]
  });

  const { url } = await server.listen({ port: 0 })

  console.log(`Gateway ready at ${url}`);
}

async function loadLibraries() {
  const { name, typeDefs, resolvers } = data.getLibraryConfiguration(gql)
  return await loadServer(name, typeDefs, resolvers)
}

async function loadBooks() {
  const { name, typeDefs, resolvers } = data.getBookConfiguration(gql)
  return await loadServer(name, typeDefs, resolvers)
}

async function loadMagazines() {
  const { name, typeDefs, resolvers } = data.getMagazineConfiguration(gql)
  return await loadServer(name, typeDefs, resolvers)
}

async function loadServer(name, typeDefs, resolvers) {
  const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    plugins: [ nrPlugin ]
  });

  const { url } = await server.listen({ port: 0 })
  console.log(`${name} service ready at ${url}`);

  return { name, url}
}
