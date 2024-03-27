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
    <button :disabled="disabled" :class="customClass" class="bg-green-600 text-slate-100 shadow-md mt-auto py-2 h-12 w-full"> 
        <div class="flex flex-row w-full justify-center items-center space-x-1 relative">
            <span class="capitalize font-medium tracking-tighter">{{ title }}</span>
            <slot name="free-area"></slot>
        </div>
        </button>
</template>