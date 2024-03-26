<script setup lang="ts">
    const props = defineProps({
        title: String,
        customClass: String,
        disabled: {
            default: false,
            type: Boolean
        }
    })

    props.title
    props.customClass
</script>

<template>
    <button :disabled="disabled" :class="customClass" class="bg-green-600 text-slate-100 shadow-md rounded-sm mt-auto py-2 h-12 w-full"> 
        <span class="capitalize font-medium tracking-tighter">{{ title }}</span>
    </button>
</template>