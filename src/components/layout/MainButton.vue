<script setup lang="ts">
    const props = defineProps({
        title: String,
        customClass: String
    })

    props.title
    props.customClass
</script>

<template>
    <button :class="customClass" class="bg-green-600 text-slate-100 shadow-md rounded-sm mt-auto mx-2 px-4 py-2 h-16 w-full"> 
        <span class="capitalize font-medium tracking-tighter">{{ title }}</span>
    </button>
</template>