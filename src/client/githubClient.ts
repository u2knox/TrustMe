import { ApolloClient, InMemoryCache } from '@apollo/client/core'

const cache = new InMemoryCache();

export default new ApolloClient({
  cache,
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer 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`
  }
});