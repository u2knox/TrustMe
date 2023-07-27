import { ApolloClient, InMemoryCache } from '@apollo/client/core'

const cache = new InMemoryCache();

export default new ApolloClient({
  cache,
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer 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`
  }
});