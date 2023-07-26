<template>
  <div>
    <div class="search">
      <input
        class="search__input"
        type="text"
        name="search"
        v-model="searchText"
        placeholder="Поиск"
      />
    </div>
    <div class="container">
      <div v-if="loading" class="container__wrapper container__wrapper_loading">Загрузка</div>
      <div v-else-if="!resultItems?.length" class="container__wrapper container__wrapper_empty">
        <span v-if="!searchText.length">В вашем репозиторий пусто ;(</span>
        <span v-else>По запросу нет совпадений</span>
      </div>
      <repository-card
        v-else
        v-for="item in resultItems"
        :key="item.updatedAt"
        :name="item.name"
        :stars="item.stargazerCount"
        :updated="item.pushedAt"
        :url="`https://github.com${item.resourcePath}`"
      >
        {{ item.node.name }}
      </repository-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { useQuery } from '@vue/apollo-composable';

import gql from 'graphql-tag';

import RepositoryCard from '@/components/RepositoryCard.vue';

const searchText = ref<string>('');

const { result: userResult } = useQuery(gql`
  query {
    viewer {
      login
    }
  }
`);

const userLogin = computed(() => userResult.value?.viewer?.login ?? '');

const searchVariables = computed(() => ({
  queryString: searchText.value.length ? `name:${searchText.value}` : `user:${userLogin.value}`
}));

const {
  result: searchResult,
  variables,
  loading
} = useQuery(
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
            }
          }
        }
      }
    }
  `,
  searchVariables
);

const resultItems = computed(() => {
  return searchResult.value?.search?.edges.map((item: any) => item.node) ?? [];
});

watchDebounced(
  searchText,
  () => {
    variables.value = searchVariables.value;
  },
  { debounce: 500, maxWait: 1000 }
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
</style>
