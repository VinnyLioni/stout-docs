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
    <header class="bg-slate-600 flex flex-row p-4 items-center">
        <div class="text-2xl tracking-tighter">
            <span class="text-slate-100">Stout</span>
            <span class="font-extrabold text-yellow-300">Docs</span>
        </div>
        <Transition name="fade" mode="out-in">
            <button class="ml-auto text-slate-100 items-center justify-center flex" v-if="showButton" @click="goBack">
                <div class="flex flex-row items-center relative pt-2">
                    <div class="content-[''] w-3 h-[3px] absolute bottom-2 bg-slate-50 rounded-l rotate-45"></div>
                    <div class="content-[''] w-3 h-[3px] bg-slate-50 -bottom-2 rounded-l -rotate-45"></div>
                </div>
            </button>
            <div v-else class="ml-auto text-slate-100">
                <span class="capitalize font-semibold tracking-tighter">menu principal</span>
            </div>
        </Transition>
    </header>
</template>

<style>
    .fade-enter-active,
    .fade-leave-active {
    transition: 300ms ease all;
    }

    .fade-enter-from,
    .fade-leave-to {
    opacity: 0;
    transform: translateX(3px);
    }
</style>