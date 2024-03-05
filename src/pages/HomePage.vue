<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import router from '../router/router';
import { onMounted } from 'vue';

    const route = useRoute()

    const changeRoute = (payload: string) => {
        router.push({ name: payload})
    }

    onMounted(() => {
        console.log(route.name)
    })


</script>

<template>
    <div class="w-full p-1 flex flex-col items-center justify-start h-full">
        <header class="py-4 flex w-full justify-center items-center">
            <span class="capitalize text-xl font-semibold -tracking-widest text-slate-800">menu principal</span>
        </header>
        <div class="w-full flex flex-col">
            <button class="bg-slate-600 text-slate-100 px-4 py-2 w-full my-1 h-20 rounded-sm" @click="changeRoute('notes')">
                <span class="capitalize">notas emitidas no dia</span>
            </button>
            <button class="bg-slate-600 text-slate-100 px-4 py-2 w-full h-20 rounded-sm my-1" @click="changeRoute('reader')">
                <span class="capitalize">identificar pacotes</span>
            </button>
        </div>
    </div>
</template>