import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { watchDebounced } from '@vueuse/core';

export const useGithubStore = defineStore('gethubStore', () => {
  // const URL = ref("https://api.github.com/graphql");

  const searchText = ref<string>('');

  const search = ref();
  
  const searchResult = computed(() => search.value.result);

  const userLogin = ref('');

  const searchVariables = computed(() => {
    if (searchText.value.length) {
      return {
        queryString: `name:${searchText.value}`
      };
    }
    if (userLogin.value) {
      return {
        queryString: `user:${userLogin.value}`
      };
    }
    return {};
  });

  const resultItems = computed(() => {
    return searchResult.value?.search?.edges.map((item: any) => item.node) ?? [];
  });

  const repoCount = computed(() => searchResult.value?.search?.repositoryCount);

  watchDebounced(
    searchText,
    () => {
      search.value.variables = searchVariables.value;
    },
    { debounce: 500, maxWait: 1000 }
  );
  
  // watchDebounced(
  //   currentPage,
  //   () => {
  //     variables.value = searchVariables.value;
  //   },
  //   { debounce: 500, maxWait: 1000 }
  // );

  return { URL, searchText, search, resultItems, searchVariables, repoCount, userLogin };
});
