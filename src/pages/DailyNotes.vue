<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useBarStore } from '../store/barcode';
import router from '../router/router';

    const barStore = useBarStore()

    const modalOpened=ref<boolean>(false)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString()
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const actualDate = `${year}-${month}-${day}`    

    const startDate = ref<string>(actualDate)
    const endDate = ref<string>(actualDate)

    const fetchNotes = () => {
        modalOpened.value=false
        barStore.fetchAllNotes(startDate.value, endDate.value)
    }
 
    const selectNote = (item: string, note: number) => {
        router.push({ name: 'identifier', params: { numeroNota: item}})
        barStore.numbernf=note
    }

    onMounted(() => {
        modalOpened.value=true
    })

    onUnmounted(() => {
        barStore.clearData()
    })

</script>

<template>
    <div class="w-full h-full flex flex-col items-center justify-start">
        <header class="w-full flex flex-col items-center">
            <div class="flex flex-row items-center py-3 justify-center text-slate-800">
                <i class="fas fa-barcode text-lg"></i>
                <span class="ml-2 text-lg font-semibold tracking-tighter capitalize">notas fiscais emitidas por período</span>
            </div>
            <button class="w-11/12 bg-green-600 text-slate-100 px-4 py-2 m-2 rounded-sm" @click="modalOpened=true">
                <span class="capitalize">alterar filtro</span>
            </button>
        </header>
        <main class="w-full flex flex-col items-center">
            <div v-if="barStore.allNotes" class="bg-slate-100 flex flex-col w-full text-xs border-[1px] rounded-sm m-1 shadow-md border-slate-600" v-for="(item, index) in barStore.allNotes" :key="index" @click="selectNote(item.nfechave, item.idnfsai)">
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
        </main>
        <Teleport to="body">
            <Transition name="page-slide" mode="out-in">
                <div v-if="modalOpened" class="flex flex-col items-center justify-center shadow-md border-sm w-full h-full fixed top-0 backdrop-blur-sm">
                    <div class="bg-slate-100 w-11/12 h-auto p-4 rounded-sm shadow-md">
                        <header class="flex flex-row w-full">
                            <span class="capitalize text-slate-800 tracking-tighter font-semibold text-xl">selecionar data</span>
                            <button class="ml-auto w-6 h-6 bg-red-700 rounded-md flex flex-row items-center justify-center" @click="modalOpened=false">
                                <i class="fas fa-xmark text-slate-100 text-2xl"></i>
                            </button>
                        </header>
                        <main class="w-full h-full mt-10 flex flex-col items-center">
                            <div class="flex flex-col w-full mb-6">
                                <span class="capitalize font-semibold tracking-tighter">início</span>
                                <input type="date" v-model="startDate" class="p-1 rounded-md shadow-sm duration-100 ease-in focus:outline-0 focus:shadow-md border-[1px] focus:border-slate-600 w-full">
                            </div>
                            <div class="flex flex-col w-full">
                                <span class="capitalize font-semibold tracking-tighter">fim</span>
                                <input type="date" v-model="endDate" class="p-1 rounded-md shadow-sm duration-100 ease-in focus:outline-0 focus:shadow-md border-[1px] focus:border-slate-600 w-full">
                            </div>
                            <div class="mt-20 w-full flex items-center justify-center">
                                <button class="w-full px-4 py-2 bg-green-600 rounded-sm shadow-sm" @click="fetchNotes">
                                    <span class="text-slate-100 font-semibold tracking-tighter">Buscar</span>
                                </button>
                            </div>
                        </main>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<style>
    .page-slide-enter-active,
    .page-slide-leave-active {
        transition: 300ms ease all;
    }

    .page-slide-enter-from,
    .page-slide-leave-to {
        opacity: 0;
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>