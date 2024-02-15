<script setup lang="ts">
    const props = defineProps({
        icon: String,
        title: String
    })
</script>

<template>
    <div class="flex flex-row w-full px-10 py-6 justify-start items-center">
        <i class="pr-8 text-xl" :class="icon"></i>
        <span class="text-lg">{{ title }}</span>
    </div>
</template>