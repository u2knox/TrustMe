import { ApolloClient, InMemoryCache } from '@apollo/client/core'

const cache = new InMemoryCache();

export default new ApolloClient({
  cache,
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer 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`
  }
});