<template>
  <div class="paginator">
    <!-- Пытался сделать пагинацию по заданию. По документации, не понял как можно было бы реализовать за отведенное время -->
    <div class="paginator__info">
      <span>Страница {{ props.page + 1 }} из {{ totalPages }}</span>
    </div>
    <div v-if="totalPages > 1" class="paginator__btn-wrapper">
      <button v-for="i in getPages" :key="i" class="paginator__btn" @click="goToPage(i)">
        <span v-if="i == getPages[getPages.length - 1] && i != totalPages">Последняя</span>
        <span v-else-if="i == getPages[0] && i != 0">1</span>
        <span v-else>{{ i + 1 }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const MAX_PAGES = 10;

interface Props {
  page: number;
  size: number;
  totalElements?: number;
}
interface Emits {
  (e: 'update:page', page: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  totalElements: 0
});
const emits = defineEmits<Emits>();

const totalPages = computed(() => {
  return Math.ceil(props.totalElements / props.size);
});

const getStartPage = computed(() => {
  const startPage = props.page - Math.floor(MAX_PAGES / 2);
  if (startPage < 0) return 0;
  return startPage;
});

const getEndPage = computed(() => {
  const endPage = getStartPage.value + MAX_PAGES;
  if (endPage < totalPages.value) return endPage;
  return totalPages.value;
});

const getPages = computed(() => {
  const arr = [];
  for (let i = getStartPage.value; i < getEndPage.value; ++i) {
    arr.push(i);
  }
  return arr;
});

const goToPage = (page: number) => {
  if (page == getPages.value[getPages.value.length - 1] && page != totalPages.value)
    emits('update:page', totalPages.value);
  else if (page == getPages.value[0] && page != 0) emits('update:page', 0);
  else emits('update:page', page);
};
</script>

<style scoped>
.paginator__btn-wrapper {
  display: flex;
  gap: 0.5rem;
}
.paginator__btn {
  border: teal solid 2px;
  color: teal;
  background: none;
  padding: 0.5rem 0.7rem;
  font-size: 1.4rem;
  cursor: pointer;
  border-radius: 0.3rem;
}
</style>
