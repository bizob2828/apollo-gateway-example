'use strict'

const nrPlugin = require('@newrelic/apollo-server-plugin')

const { ApolloServer } = require('apollo-server')
const { ApolloGateway } = require("@apollo/gateway")

loadGateway().catch((err) => {
  console.error(err)
  process.exit(1)
})

async function loadGateway() {
  const gateway = new ApolloGateway({
    serviceList: [
      { name: 'libraries', url: 'http://localhost:3000'},
      { name: 'books', url: 'http://localhost:3001'},
      { name: 'magazines', url: 'http://localhost:3002'},
    ]
  });

  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    plugins: [ nrPlugin ]
  });

  const { url } = await server.listen({ port: process.env.PORT || 0 })

  console.log(`Gateway ready at ${url}`);
}

