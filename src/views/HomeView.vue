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
    <simple-pagination
      :page="githubStore.pageInfo"
      class="pagination"
      @prev="goToPrev"
      @next="goToNext"
    ></simple-pagination>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

import { useGithubStore } from '@/stores/githubStore';

import RepositoryCard from '@/components/RepositoryCard.vue';
// import SquadPaginator from '@/components/SquadPaginator.vue';
import SimplePagination from '@/components/SimplePagination.vue';
import { storeToRefs } from 'pinia';

const githubStore = useGithubStore();
const { searchText, searchResult, userLogin, afterCursor, beforeCursor } = storeToRefs(githubStore);

// const ITEMS_ON_PAGE = 10;
// const currentPage = ref(0);

const { result: user } = useQuery(gql`
  query {
    viewer {
      login
    }
  }
`);

const searchVariables = computed(() => ({
  queryString: searchText.value.length ? `name:${searchText.value}` : `user:${userLogin.value}`,
  after: afterCursor.value,
  before: beforeCursor.value
}));

watch(user, (val) => {
  userLogin.value = val.viewer?.login;
  variables.value = searchVariables.value;
});

const { result, variables, loading } = useQuery(
  gql`
    query SearchMostTop10Star($queryString: String!, $after: String, $before: String) {
      search(query: $queryString, type: REPOSITORY, first: 10, after: $after, before: $before) {
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
        pageInfo {
          startCursor
          hasNextPage
          hasPreviousPage
          endCursor
        }
      }
    }
  `,
  searchVariables.value
);

watch(result, (val) => (searchResult.value = val));

watchDebounced(
  searchText,
  () => {
    variables.value = searchVariables.value;
    // search.value.refetch();
  },
  { debounce: 500, maxWait: 1000 }
);

const goToPrev = (val: string) => {
  beforeCursor.value = val;
  afterCursor.value = null;
  variables.value = {
    queryString: searchText.value.length ? `name:${searchText.value}` : `user:${userLogin.value}`,
    after: afterCursor.value,
    before: beforeCursor.value
  };
};

const goToNext = (val: string) => {
  beforeCursor.value = null;
  afterCursor.value = val;
  variables.value = {
    queryString: searchText.value.length ? `name:${searchText.value}` : `user:${userLogin.value}`,
    after: afterCursor.value,
    before: beforeCursor.value
  };
};
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
