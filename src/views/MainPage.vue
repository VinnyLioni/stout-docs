<script setup lang="ts">
  import navBar from '../components/navBar.vue';
</script>

<template>
  <div class="flex flex-col h-screen w-full">
    <navBar />
    <div class="flex flex-row items-center justify-center rounded-md w-full h-full">
      <RouterView v-slot="{ Component }">
        <Transition name="page-slide" mode="out-in">
          <component :is="Component"></component>
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped>
    .page-opacity-enter-active,
    .page-opacity-leave-active {
        transition: 300ms ease all;
    } 

    .page-opacity-enter-from,
    .page-opacity-leave-to {
        opacity: 0;
    }

    .page-slide-enter-active,
    .page-slide-leave-active {
        transition: 300ms ease all;
    }

    .page-slide-enter-from,
    .page-slide-leave-to {
        opacity: 0;
        transform: translateX(-10px);
    }
</style>
