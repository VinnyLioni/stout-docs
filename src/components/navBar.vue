<script setup lang="ts">
    import { onMounted, ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    
    const route = useRoute()
    const router = useRouter()
    const showButton = ref(route.name !== 'home')

    const goBack = () => {
        router.go(-1)
    }

    watch(() => route.name, (NewValue) => {
        showButton.value=NewValue !== 'home'
    })

    onMounted(() => {
    })

</script>

<template>
    <header class="bg-slate-600 flex flex-row p-4">
        <div class="text-2xl tracking-tighter">
            <span class="text-slate-100">Stout</span>
            <span class="font-extrabold text-yellow-300">Docs</span>
        </div>
        <Transition name="fade">
            <button class="ml-auto text-slate-100" v-if="showButton" @click="goBack">
                <span class="capitalize text-lg tracking-tighter font-medium">voltar</span>
            </button>
        </Transition>
    </header>
</template>

<style>
    .fade-enter-active,
    .fade-leave-active {
    transition: opacity 0.2s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
    opacity: 0;
    }
</style>