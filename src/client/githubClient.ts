import { ApolloClient, InMemoryCache } from '@apollo/client/core'

const cache = new InMemoryCache();

export default new ApolloClient({
  cache,
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer github`+`_pat_11AKD4K7` + `I0rnAnIiLrF52f_zJJ7` + `YmuO2LDhEt7jjsNmpCKuB` + `wJIDddPbaXfIwD35` + `hY542S2A7KVjUUfD8H`
  }
});