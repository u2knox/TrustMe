import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useGithubStore = defineStore('gethubStore', () => {
  // const URL = ref("https://api.github.com/graphql");

  const searchText = ref<string>('');
  const searchResult = ref();
  const userLogin = ref('');
  const afterCursor = ref<string | null>(null);
  const beforeCursor = ref<string | null>(null);

  const resultItems = computed(() => {
    return searchResult.value?.search?.edges.map((item: any) => item.node) ?? [];
  });

  const pageInfo = computed(() => searchResult.value?.search?.pageInfo);
  const repoCount = computed(() => searchResult.value?.search?.repositoryCount);

  // watchDebounced(
  //   currentPage,
  //   () => {
  //     variables.value = searchVariables.value;
  //   },
  //   { debounce: 500, maxWait: 1000 }
  // );

  return { URL, searchText, resultItems, afterCursor, beforeCursor, repoCount, userLogin, pageInfo, searchResult };
});
