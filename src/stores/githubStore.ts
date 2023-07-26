import { ref } from 'vue';
import { defineStore } from 'pinia'

export const useGithubStore = defineStore('gethubStore', () => {
  const URL = ref("https://api.github.com/graphql");
  
  return { URL }
})
