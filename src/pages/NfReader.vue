<script setup lang="ts">
    import BarCode from '../components/layout/BarCode.vue';
    // import MainButton from '../components/layout/MainButton.vue';  
    import router from '../router/router';
    import { useBarStore } from '../store/barcode';

    const barStore = useBarStore()
    const getNF = async (payload: string) => {
        await barStore.fetchNfData(payload)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString()
    }

    const clearData = () => {
        barStore.clearData()
    }

    const selectNote = (item: string) => {
        router.push({ name: 'identifier', params: { numeroNota: item, idnfsai: barStore.numbernf}})
    }

</script>

<template>
    <div class="bg-stout-gray w-full h-full flex flex-col items-center justify-center">
        <div class="flex flex-row items-center py-3 justify-center text-slate-800">
            <i class="fas fa-barcode text-lg"></i>
            <span class="ml-2 text-lg font-semibold tracking-tighter capitalize">leitor de notas fiscais</span>
        </div>
        <div class="flex flex-col items-center mx-2 justify-center w-full">
            <BarCode @codeDetected="getNF(barStore.codebar)"/>
        </div>
        <div class="flex flex-col w-full justify-center items-center p-1 rounded-sm">
            <header class="w-full shadow-md flex justify-center bg-slate-600 text-slate-100 tracking-tighter font-semibold text-lg py-2">
                <transition name="page-slide" mode="out-in">
                    <span v-if="barStore.fetchednf">Dados da NF</span>
                    <span v-else>Aguardando Leitura de NF</span>
                </transition>
            </header>
            <div class="flex flex-col w-full items-center justify-start relative">
                <Transition name="page-slide" mode="out-in">
                    <div v-if="barStore.loading" class="w-full flex flex-row items-center justify-center p-8 absolute top-20">
                        <i class="fas fa-circle-notch fa-spin text-3xl"></i>
                    </div>
                    <div v-else class="bg-slate-100 flex flex-col items-center justify-start w-full text-xs rounded-sm m-2 shadow-md border-slate-600">
                        <div v-if="barStore.fetchednf" class="px-2 py-1 flex flex-col justify-around" v-for="(item, index) in barStore.fetchednf" :key="index">
                            <header class="flex flex-row w-full">
                                <div class="">
                                    <span class="mr-1 text-slate-800 font-semibold tracking-tighter">NF:</span>
                                    <span>{{ item.idnfsai }}</span>
                                </div>
                            <div class="ml-auto">
                                <span class="mr-1 text-slate-800 font-semibold tracking-tighter">Data:</span>
                                <span>{{ formatDate(item.dt) }}</span>
                            </div>
                        </header>
                        <div class="flex flex-row items-baseline w-full">
                            <span class="mr-1 text-slate-800 font-semibold tracking-tighter">Cliente:</span>
                            <span class="ml-auto">{{ item.fantasia }}</span>
                        </div>
                        <div class="flex flex-row items-baseline w-full">
                            <span class="mr-1 text-slate-800 font-semibold tracking-tighter">Chave:</span>
                            <span class="tracking-tighter ml-auto">{{ item.nfechave }}</span>
                        </div>
                    </div>
                </div>
                </Transition>
            </div>
        </div>
        <div class="mt-auto"></div>
        <div class="flex flex-row mt-auto w-full rounded-sm fixed bottom-0 p-1">
            <button @click="selectNote(barStore.codebar)" :disabled="!barStore.fetchednf" class=" text-slate-100 rounded-l-sm mt-auto py-2 h-12 w-full" :class="barStore.fetchednf ? 'bg-green-600' : 'bg-slate-500 text-slate-300'"> 
                <span class="capitalize font-medium tracking-tighter">identificar pacotes</span>
            </button>
            <button class="bg-slate-500 text-slate-100 rounded-r-sm mt-auto py-2 h-12 w-full" @click="clearData"> 
                <span class="capitalize font-medium tracking-tighter">retornar</span>
            </button>
        </div>
    </div>
</template>

<style>
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