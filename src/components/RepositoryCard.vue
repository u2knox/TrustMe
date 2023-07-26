<template>
  <div class="card">
    <router-link :to="{ name: 'repository', params: { id: 1 } }">
      <h2 class="card__title">{{ props.name }}</h2>
    </router-link>
    <span class="card__stars">Звезд: {{ props.stars }}</span>
    <span class="card__stars"
      >Последний коммит был добавлен: {{ formatDate(new Date(props.updated)) }}</span
    >
    <a :href="props.url" target="_blank">Ссылка на репозиторий</a>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  stars: number;
  updated: string;
  url: string;
}
const props = defineProps<Props>();

const formatDate = (date: Date) => {
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
};
</script>

<style scoped>
.card {
  -webkit-box-shadow: 0px 4px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 4px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 4px 8px 0px rgba(34, 60, 80, 0.2);
  margin: 1rem;
  padding: 0.6rem 1.5rem;
  border-radius: 0.4rem;
  display: flex;
  flex-direction: column;
}
.card__title {
  color: teal;
}
</style>
