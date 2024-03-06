<script setup lang="ts">
    import BarCode from '../components/layout/BarCode.vue';
    import MainButton from '../components/layout/MainButton.vue';  
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
    <div class="bg-slate-300 w-full h-full flex flex-col items-center justify-center">
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
            <TransitionGroup name="page-slide">
                <div v-if="barStore.fetchednf" class="bg-slate-100 flex flex-col w-full text-xs border-[1px] rounded-sm m-2 shadow-md border-slate-600" v-for="(item, index) in barStore.fetchednf" :key="index">
                    <header class="flex flex-row w-full pt-1 px-1">
                        <div class="">
                            <span class="mr-1">NF:</span>
                            <span>{{ item.idnfsai }}</span>
                        </div>
                        <div class="ml-auto">
                            <span class="mr-1">Data:</span>
                            <span>{{ formatDate(item.dt) }}</span>
                        </div>
                    </header>
                    <main class="flex flex-col items-start p-1 gap-1">
                        <div class="flex flex-row items-baseline w-full">
                            <span class="mr-1">Cliente:</span>
                            <span class="ml-auto">{{ item.fantasia }}</span>
                        </div>
                        <div class="flex flex-row items-baseline w-full">
                            <span class="mr-1">Chave:</span>
                            <span class="tracking-tighter ml-auto">{{ item.nfechave }}</span>
                        </div>
                    </main>
                </div>
            </TransitionGroup>
        </div>
        <div class="flex flex-row mt-auto w-full rounded-sm my-4">
            <MainButton title="identificar pacotes" :class="barStore.fetchednf ? '' : 'bg-slate-500 text-slate-300'" customClass="duration-200 ease-in" @click="selectNote(barStore.codebar)"/>
            <MainButton title="retornar" customClass="bg-slate-600" @click="clearData"/>
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