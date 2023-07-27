import { ApolloClient, InMemoryCache } from '@apollo/client/core'

const cache = new InMemoryCache();

export default new ApolloClient({
  cache,
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer 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`
  }
});