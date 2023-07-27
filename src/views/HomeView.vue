<template>
  <div>
    <div class="search">
      <input
        class="search__input"
        type="text"
        name="search"
        v-model="githubStore.searchText"
        placeholder="Поиск"
      />
    </div>
    <div class="container">
      <div v-if="githubStore.search.loading" class="container__wrapper container__wrapper_loading">
        Загрузка
      </div>
      <div
        v-else-if="!githubStore.resultItems?.length"
        class="container__wrapper container__wrapper_empty"
      >
        <span v-if="!githubStore.searchText.length">В вашем репозиторий пусто ;(</span>
        <span v-else>По запросу нет совпадений</span>
      </div>
      <repository-card
        v-else
        v-for="item in githubStore.resultItems"
        :key="item.updatedAt"
        :name="item.name"
        :owner="item.owner.login"
        :stars="item.stargazerCount"
        :updated="item.pushedAt"
        :url="`https://github.com${item.resourcePath}`"
        class="card"
      >
        {{ item.node.name }}
      </repository-card>
    </div>
    <squad-paginator
      v-if="!githubStore.search.loading"
      v-model:page="currentPage"
      :size="ITEMS_ON_PAGE"
      :total-elements="githubStore.repoCount"
      class="pagination"
    ></squad-paginator>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

import { useGithubStore } from '@/stores/githubStore';

import RepositoryCard from '@/components/RepositoryCard.vue';
import SquadPaginator from '@/components/SquadPaginator.vue';

const githubStore = useGithubStore();

const ITEMS_ON_PAGE = 10;
const currentPage = ref(0);

const { result: user } = useQuery(gql`
  query {
    viewer {
      login
    }
  }
`);

watch(user, (val) => {
  githubStore.userLogin = val.viewer?.login;
  if (githubStore.search?.variables) {
    githubStore.search.variables = githubStore.searchVariables;
  }
});

githubStore.search = useQuery(
  gql`
    query SearchMostTop10Star($queryString: String!) {
      search(query: $queryString, type: REPOSITORY, first: 10) {
        repositoryCount
        edges {
          node {
            ... on Repository {
              name
              stargazerCount
              resourcePath
              pushedAt
              owner {
                login
              }
            }
          }
        }
      }
    }
  `,
  githubStore.searchVariables
);
</script>

<style scoped>
.search {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
}
.search__input {
  border: 2px solid teal;
  min-width: 36rem;
  border-radius: 0.4rem;
  font-size: 1.6rem;
  padding: 0.6rem;
  -webkit-box-shadow: 0px 4px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 4px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 4px 8px 0px rgba(34, 60, 80, 0.2);
}
.container__wrapper {
  display: flex;
  justify-content: center;
  font-size: 2rem;
}
.container__wrapper_empty {
  color: teal;
}
.container__wrapper_loading {
  color: yellowgreen;
}
.card {
  margin: 1rem;
}
.pagination {
  margin: 1rem 1.4rem;
}
</style>
