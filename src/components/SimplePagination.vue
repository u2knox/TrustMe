<template>
  <div class="paginator">
    <div class="paginator__btn-wrapper" v-if="props.page">
      <button
        v-if="props.page.hasPreviousPage"
        class="paginator__btn"
        @click="emits('prev', props.page.startCursor)"
      >
        Предыдущая
      </button>
      <button
        v-if="props.page.hasNextPage"
        class="paginator__btn"
        @click="emits('next', props.page.endCursor)"
      >
        Следующая
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  page?: {
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
  };
}
interface Emits {
  (e: 'prev', cursor: string): void;
  (e: 'next', cursor: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
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
