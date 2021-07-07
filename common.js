const { ApolloServer, gql } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')
const nrPlugin = require('@newrelic/apollo-server-plugin')

const common = module.exports

common.loadServer = async function loadServer(name, typeDefs, resolvers) {
  const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    plugins: [ nrPlugin ]
  });

  const { url } = await server.listen({ port: process.env.PORT || 0 })
  console.log(`${name} service ready at ${url}`);

  return { name, url}
}
