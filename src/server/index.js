const { makeExecutableSchema } = require("graphql-tools");
const graphqlHTTP = require("express-graphql");
const fs = require("fs");
const resolvers = require("./resolvers");

const typeDefs = fs.readFileSync(require.resolve("./schema.gql"), "utf8");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = graphqlHTTP({
  schema,
  graphiql: true
});
