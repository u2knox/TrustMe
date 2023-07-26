import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', () => {
  // В будущем можно будет связать с localStorage
  const accessToken = ref<string>('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');

  return { accessToken }
})
