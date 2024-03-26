<script setup lang="ts">
    import router from '../router/router';
    import { onMounted } from 'vue';


    const changeRoute = (payload: string) => {
        router.push({ name: payload})
    }

    onMounted(() => {
    })


</script>

<template>
    <div class="w-full flex flex-col items-center justify-start h-full">
        <div class="w-full flex flex-col">
            <button class="bg-stout-gray text-slate-700 px-4 py-2 w-full h-20 rounded-sm font-medium tracking-tighter flex flex-row items-center justify-center" @click="changeRoute('notes')">
                <span class="capitalize flex-1">notas fiscais por período</span>
                <div class="flex flex-row items-center relative pt-2 ml-auto">
                    <div class="content-[''] w-3 h-[2px] absolute bottom-2 bg-slate-600 rounded-l rotate-45"></div>
                    <div class="content-[''] w-3 h-[2px] bg-slate-600 -bottom-2 rounded-l -rotate-45"></div>
                </div>
            </button>
            <button class="bg-stout-gray text-slate-700 px-4 py-2 w-full h-20 rounded-sm font-medium tracking-tighter flex flex-row items-center justify-center" @click="changeRoute('reader')">
                <span class="capitalize flex-1">identificar pacotes</span>
                <div class="flex flex-row items-center relative pt-2 ml-auto">
                    <div class="content-[''] w-3 h-[2px] absolute bottom-2 bg-slate-600 rounded-l rotate-45"></div>
                    <div class="content-[''] w-3 h-[2px] bg-slate-600 -bottom-2 rounded-l -rotate-45"></div>
                </div>
            </button>
        </div>
    </div>
</template>