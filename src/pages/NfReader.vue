<script setup lang="ts">
    import BarCode from '../components/layout/BarCode.vue';
    // import MainButton from '../components/layout/MainButton.vue';  
    import router from '../router/router';
    import { useBarStore } from '../store/barcode';
    import { ref } from 'vue';

    const isloading = ref<boolean>(false)

    const barStore = useBarStore()
    const getNF = async (payload: string) => {
        isloading.value=true
        try {
            await barStore.fetchNfData(payload)
        } catch(e) {
            console.error(e)
        } finally {
            isloading.value=false
        }
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

    // onMounted(() => {
    //     getNF("35240241666087000118550020000006331813086293")
    // })

</script>

<template>
    <div class="bg-stout-gray w-full h-full flex flex-col items-center justify-center">
        <div class="flex flex-col w-full relative justify-center items-center">
            <div class="bg-slate-600 w-full py-3">
                <div class="text-slate-100 pb-6 px-3">
                    <i class="fas fa-barcode text-lg"></i>
                    <span class="capitalize tracking-tighter font-semibold text-md ml-2 ">leitor de notas fiscais</span>
                </div>
            </div>
            <div class="w-11/12 bg-slate-100 py-1 px-4 absolute top-12 flex flex-col justify-center items-center rounded-sm shadow h-12 duration-200 ease-in">
                <Transition name="page-slide" mode="out-in">
                    <div class="flex flex-col items-center justify-center px-2 w-full h-12" v-if="!barStore.fetchednf">
                        <!-- <i class="fas fa-circle-notch fa-spin text-2xl text-slate-500"></i> -->
                        <span class="font-medium tracking-tighter">Aguardando leitura de NF</span>
                    </div>
                    <!-- <div v-else class="w-full">
                        <div :key="index" class="flex flex-col items-center justify-center px-2 w-full h-12" v-for="(item, index) in barStore.fetchednf">
                        <header class="flex flex-row w-full items-baseline">
                            <div class="flex flex-row w-8/12">
                                <span class="font-medium tracking-tighter overflow-hidden whitespace-nowrap max-w-full truncate text-xs">{{ item.fantasia }}</span>
                            </div>
                            <div class="ml-auto">
                                <span class="text-[0.8rem]">{{ formatDate(item.dt) }}</span>
                            </div>
                        </header>
                        <div class="flex flex-row items-baseline w-full">
                            <div>
                                <span class="tracking-tighter ml-auto text-[0.63rem] whitespace-nowrap max-w-full truncate">{{ item.nfechave }}</span>
                            </div>
                            <div class="ml-auto">
                                <span class="text-green-800 font-medium">{{ item.doc }}</span>
                            </div>
                        </div>
                        </div>
                    </div> -->
                    <div v-else class="w-full">
                        <div v-for="item in barStore.fetchednf" class="w-full flex flex-row items-center tracking-tighter font-semibold text-sm">
                            <header class="flex flex-row w-full">
                                <div class="flex flex-row items-baseline w-8/12">
                                    <span class="font-medium tracking-tighter overflow-hidden whitespace-nowrap max-w-full truncate">{{ item.fantasia }}</span>
                                </div>
                                <div class="ml-auto">
                                    <div class="flex text-[0.65rem] items-center justify-center text-slate-100 px-[0.25rem] py-[0.125rem] rounded w-16" :class="item.countrastreios.length > 0 ? 'bg-green-600' : 'bg-amber-400'">
                                        <div v-if="item.countrastreios.length > 0" class="flex flex-row justify-around w-full">
                                            <span>{{ item.countrastreios.length }}</span>
                                            <span>{{ item.countrastreios.length > 1 ? 'Rastreios' : 'Rastreio'}}</span>
                                        </div>
                                        <span v-else class="capitalize">pendente</span>
                                    </div>
                                </div>
                            </header>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
        <div class="flex flex-col items-center mx-2 justify-center w-full mt-10">
            <BarCode @codeDetected="getNF(barStore.codebar)"/>
        </div>
        <div class="flex flex-col w-full justify-center items-center rounded-sm">
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
                    <div v-else class="w-full">
                        <div v-for="(item, index) in barStore.fetchednf" :key="index" class="bg-slate-50 p-[0.35rem] flex flex-col border-t-[0.05rem] w-full border-slate-300 space-y-1">
                            <div class="py-1 flex flex-col justify-around w-full text-slate-600 space-y-2">
                                <div class="flex flex-row text-base tracking-tighter font-semibold w-full">
                                    <div class="flex flex-row items-baseline space-x-2">
                                        <span>NF:</span>
                                        <span>{{ item.idnfsai }}</span>
                                    </div>
                                    <div class="ml-auto">
                                        <span>
                                            {{ formatDate(item.dt) }}
                                        </span>
                                    </div>
                                </div>
                                <div class="text-base tracking-tighter font-semibold">
                                    <span class="">{{ item.fantasia }}</span>
                                </div>
                                <div class="w-full flex justify-center">
                                    <span class="text-[0.9rem] font-medium tracking-tighter">{{ item.nfechave }}</span>
                                </div>

                            </div>
                        </div>
                    </div>
                    <!-- <div v-else class="bg-slate-100 flex flex-col items-center justify-start w-full text-xs rounded-sm m-2 shadow-md border-slate-600">
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
                    </div> -->
                </Transition>
            </div>
        </div>
        <div class="mt-auto"></div>
        <div class="flex flex-row mt-auto w-full rounded-sm fixed bottom-0 p-1">
            <button @click="selectNote(barStore.codebar)" :disabled="!barStore.fetchednf" class=" text-slate-100 rounded-l-sm mt-auto py-2 h-12 w-full" :class="barStore.fetchednf ? 'bg-green-600' : 'bg-slate-500 text-slate-300'"> 
                <span class="capitalize font-medium tracking-tighter">identificar pacotes</span>
            </button>
            <button class="bg-slate-500 text-slate-100 rounded-r-sm mt-auto py-2 h-12 w-full" @click="clearData"> 
                <span class="capitalize font-medium tracking-tighter">limpar</span>
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