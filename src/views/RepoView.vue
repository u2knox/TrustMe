<template>
  <div class="card">
    <div class="card__wrapper" v-if="repo">
      <h2>
        {{
          `${repo['name']} - ${repo['stargazerCount']} звезд - ${formatDate(
            new Date(repo['pushedAt'])
          )}`
        }}
      </h2>
      <div class="owner">
        <img class="owner__avatar" :src="repo['owner']['avatarUrl']" alt="avatar">
        <h3 class="owner__name">{{ repo['owner']['login'] }}</h3>
      </div>
      <div class="languages">
        <h3>Список языков</h3>
        <div v-for="node in repo['languages'].nodes" :key="node.name" :style="{color: node.color}">{{ node.name }}</div>
      </div>
      <div class="description">Описание: {{ repo["description"] }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';

import gql from 'graphql-tag';

interface Props {
  owner: string;
  name: string;
}
const props = defineProps<Props>();

const searchVariables = computed(() => ({
  owner: props.owner,
  name: props.name
}));

const { result, variables } = useQuery(
  gql`
    query getRepoInfo($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        name
        stargazerCount
        resourcePath
        pushedAt
        owner {
          login
          avatarUrl
        }
        languages(first: 100) {
          nodes {
            color
            name
          }
        }
        description
      }
    }
  `,
  searchVariables
);

const repo = computed(() => result.value?.['repository']);

watch(
  () => props,
  () => {
    variables.value = searchVariables.value;
  }
);

const formatDate = (date: Date) => {
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
};
</script>

<style scoped>
.card {
  display: flex;
  justify-content: center;
  padding: 1rem 4rem;
}
.card__wrapper {
  -webkit-box-shadow: 0px 4px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 4px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 4px 8px 0px rgba(34, 60, 80, 0.2);
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.owner {
  display: flex;
  align-items: center;
  gap: 3rem;
}
.owner__avatar {
  width: 200px;
  height: 200px;
  border-radius: 6rem;
}
</style>
