<script setup lang="ts">
  import navBar from '../components/navBar.vue';
  import MainContent from '../components/MainContent.vue'
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <navBar />
    <div class="flex flex-row items-center justify-center p-6 rounded-md">
      <MainContent />
    </div>
  </div>
</template>

<style scoped>

</style>
