<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useBarStore } from '../store/barcode';
import router from '../router/router';

    const barStore = useBarStore()

    const modalOpened=ref<boolean>(false)

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const actualDate = `${year}-${month}-${day}`    

    const startDate = ref<any>()
    const endDate = ref<any>()

    const fetchNotes = () => {
        modalOpened.value=false
        barStore.fetchAllNotes(startDate.value, endDate.value)
        barStore.startDate=startDate.value
        barStore.endDate=endDate.value
    }
 
    const selectNote = (item: string, note: number) => {
        router.push({ name: 'identifier', params: { numeroNota: item}})
        barStore.numbernf=note
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString()
    }

    const filterData = (payload: string) => {
        const date = new Date(payload);
        const day = String(date.getDate()).padStart(2, '0'); 
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear(); 

        return `${day}/${month}/${year}`;
    }

    onMounted(() => {
        modalOpened.value=true
        if (!barStore.startDate) {
            startDate.value=actualDate
            endDate.value=actualDate
        } else {   
            startDate.value=barStore.startDate
            endDate.value=barStore.endDate
        }
    })

    onUnmounted(() => {
        barStore.clearData()
    })

</script>

<template>
    <div class="w-full h-full flex flex-col items-center justify-start">
        <header class="w-full flex flex-col items-center shadow-sm z-10 relative mb-6">
                <div class="flex flex-row items-center -mt-6 justify-center text-slate-100 bg-slate-600 w-full h-[5.65rem] px-4">
                    <i class="fas fa-barcode text-lg"></i>
                    <span class="ml-2 text-lg font-semibold tracking-tighter capitalize flex-wrap w-1/3">notas fiscais</span>
                    <button class="ml-auto text-2xl" @click="modalOpened=true">
                        <i class="fas fa-magnifying-glass"></i>
                    </button>
                </div>
            <div class="w-11/12 bg-white text-slate-700 px-4 py-2 m-2 rounded-sm absolute shadow-sm top-10 flex justify-center items-center text-sm">
                <span class="font-semibold text-slate-700">De {{ filterData(startDate) }} á {{ filterData(endDate) }}</span>
            </div>
        </header>
        <Transition name="page-slide" mode="out-in">
            <main class="w-full h-full flex flex-col items-center justify-center" v-if="barStore.loading">
                <i class="fas fa-circle-notch fa-spin text-5xl"></i>
            </main>
            <main class="w-full h-[36rem] shadow-inner px-1 pb-12 flex flex-col items-center overflow-x-clip overflow-y-scroll rounded-lg inset-4" v-else>
                <div v-if="barStore.allNotes" class="bg-slate-50 flex flex-col border-t-[0.05rem] w-full text-xs p-1 border-slate-300 space-y-1" v-for="(item, index) in barStore.allNotes" :key="index" @click="selectNote(item.nfechave, item.idnfsai)">
                    <div class="px-2 py-1 flex flex-col justify-around">
                        <header class="flex flex-row w-full">
                            <div class="flex flex-row items-baseline w-8/12">
                                <span class="font-medium tracking-tighter overflow-hidden whitespace-nowrap max-w-full truncate">{{ item.fantasia }}</span>
                            </div>
                            <div class="ml-auto">
                                <span>{{ formatDate(item.dt) }}</span>
                            </div>
                        </header>
                        <div class="flex flex-row items-baseline w-full">
                            <div>
                                <span class="tracking-tighter ml-auto text-[0.63rem] whitespace-nowrap max-w-full truncate">{{ item.nfechave }}</span>
                            </div>
                            <div class="ml-auto">
                                <span class="text-green-800 font-medium">R$999,99</span>
                            </div>
                        </div>

                        <footer class="flex flex-row w-full">
                            <div class="flex text-[0.65rem] items-center justify-center text-slate-100 px-[0.25rem] py-[0.125rem] rounded w-16" :class="item.countrastreios ? 'bg-green-600' : 'bg-amber-400'">
                                <div v-if="item.countrastreios > 0" class="flex flex-row justify-around w-full">
                                    <span>{{ item.countrastreios }}</span>
                                    <span>{{ item.countrastreios > 1 ? 'Rastreios' : 'Rastreio'}}</span>
                                </div>
                                <span v-else class="capitalize">pendente</span>
                            </div>
                            <div class="flex flex-row items-baseline ml-auto">
                                <span class="mr-1 text-slate-800 font-semibold tracking-tighter">NF:</span>
                                <span>{{ item.doc }}</span>
                            </div>                                
                        </footer>
                    </div>
                </div>
            </main>
        </Transition>
        <div class="mt-auto"></div>
        <footer class="fixed bottom-0 w-full bg-stout-gray text-slate-600 text-xs py-1 flex justify-center">
            <span>© Stout 2024. Todos os direitos reservados.</span>
        </footer>
        <Teleport to="body">
            <Transition name="page-slide" mode="out-in">
                <div v-if="modalOpened" class="flex z-20 flex-col items-center justify-center shadow-md border-sm w-full h-full fixed top-0 backdrop-blur-sm">
                    <div class="bg-slate-50 w-11/12 h-auto p-4 rounded-sm shadow-md">
                        <header class="flex flex-row w-full">
                            <span class="capitalize text-slate-800 tracking-tighter font-semibold text-xl">selecionar data</span>
                            <button class="ml-auto w-6 h-6 bg-red-700 rounded-md flex flex-row items-center justify-center" @click="modalOpened=false">
                                <i class="fas fa-xmark text-slate-100 text-2xl"></i>
                            </button>
                        </header>
                        <main class="w-full h-full mt-10 flex flex-col items-center">
                            <div class="flex flex-col w-full mb-6">
                                <span class="capitalize font-semibold tracking-tighter">início</span>
                                <input type="date" v-model="startDate" class="bg-stout-gray p-1 rounded-sm shadow-sm duration-100 ease-in focus:outline-0 focus:shadow-md border-[1px] focus:border-slate-300 w-full">
                            </div>
                            <div class="flex flex-col w-full">
                                <span class="capitalize font-semibold tracking-tighter">fim</span>
                                <input type="date" v-model="endDate" class="bg-stout-gray p-1 rounded-sm shadow-sm duration-100 ease-in focus:outline-0 focus:shadow-md border-[1px] focus:border-slate-300 w-full">
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