<template>
  <div>
    {{ props.id }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
}
const props = defineProps<Props>();
</script>

<style scoped>

</style>