<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import BarCode2 from '../components/layout/BarCode2.vue';
    import MainButton from '../components/layout/MainButton.vue';
    import { useBarStore } from '../store/barcode';
    import { useRoute, useRouter } from 'vue-router';

    const router = useRouter()
    const route = useRoute()
    const barStore = useBarStore()
    const fetchedTrack = ref<any>()
    const titleNf = ref<any>()
    const deleting = ref<boolean>(false)

    const selectedRastreio=ref<number>(0)
    const sureToDelete = ref<boolean>(false)
    const openSure = (rastreio: number) => {
        sureToDelete.value=true
        selectedRastreio.value=rastreio
    }

    const deleteTrack = async () => {
        deleting.value=true
        if (selectedRastreio.value) {
            try {
                await barStore.wipeTrack(selectedRastreio.value)
                await loadTracks()
            } catch(e) {
                console.error(e)
            } finally {
                deleting.value=false
                sureToDelete.value=false
            }
        } 
    }

    interface TrackData {
        idrastreio: number | null;
        idnfsai: number;
        rastreio: string;
    }

    const postTrack = async (payload: TrackData) => {
        await barStore.createTrack(payload)
        await loadTracks()
    }

    const newInserted = ref<boolean>(false)

    const changeInserted = () => {
        newInserted.value = true;
        setTimeout(() => {
            newInserted.value = false;
        }, 2000);
    }

    const newTracker = ref<TrackData>()

    const handleCodeDetected = async () => {
        if (barStore.objcode) {
            const trackData: TrackData = {
                idrastreio: null,
                idnfsai: barStore.numbernf,
                rastreio: barStore.objcode
            };
            try {
                await postTrack(trackData);
                newTracker.value=trackData
                console.log('newTracker', newTracker.value)
                barStore.showToast('success', `Rastreio ${newTracker.value.rastreio} inserido`)
                await loadTracks()
            } catch(e) {
                console.error(e)
            } finally {
                changeInserted()
            }
        } else {
            console.error("O campo rastreio não está preenchido.");
        }
    }

    const loadTracks = async () => { 
        const numeroNota = route.params.numeroNota;
        titleNf.value=numeroNota
        if (Array.isArray(numeroNota)) {
            await Promise.all(numeroNota.map(async (numero: string) => {
                await barStore.fetchTracker(numero)
                fetchedTrack.value=barStore.fetchedTrack
                console.log(fetchedTrack.value)
            }))
        } else {
            await barStore.fetchTracker(numeroNota)
            fetchedTrack.value=barStore.fetchedTrack
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString()
    }

    const goBack = () => {
        router.go(-1)
    }

    onMounted(async () => {
        barStore.loading=false
        await loadTracks()
        await barStore.fetchNfData(titleNf.value)
    })

</script>

<template>
    <div class="bg-stout-gray w-full h-full flex flex-col items-center justify-start">
        <div class="flex flex-col w-full relative justify-center items-center">
            <div class="w-full bg-slate-600 py-3">
                <div class="text-slate-100 pb-6 px-3">
                    <i class="fas fa-barcode text-lg"></i>
                    <span class="capitalize tracking-tighter font-semibold text-md ml-2 ">identificador de pacotes</span>
                </div>
            </div>
            <div class="w-11/12 bg-slate-100 pt-1 pb-2 px-2 absolute top-12 flex flex-col justify-center items-center rounded-sm shadow h-12 duration-200 ease-in">
                <Transition name="page-slide" mode="out-in">
                    <div class="flex flex-col items-center justify-center px-2 w-full h-12" v-if="barStore.loading">
                        <i class="fas fa-circle-notch fa-spin text-2xl text-slate-500"></i>
                    </div>
                    <div v-else class="w-full">
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
                                <span class="tracking-tighter ml-auto text-[0.75rem] whitespace-nowrap max-w-full truncate">{{ item.nfechave }}</span>
                            <div class="ml-auto">
                                <span class="text-green-800 font-medium">{{ item.doc }}</span>
                            </div>
                        </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
        <div class="flex flex-col items-center mx-2 justify-center w-full mt-10">
            <BarCode2 @codeDetected="handleCodeDetected"/>
        </div>
        <div class="flex flex-col w-full justify-center items-center rounded-sm">
            <!-- <div class="w-full h-20 flex items-start justify-center"> -->
                <!-- <Transition name="page-slide" mode="out-in">
                    <div v-if="barStore.loading" class="w-full flex flex-row items-center justify-center p-8">
                        <i class="fas fa-circle-notch fa-spin text-3xl"></i>
                    </div>
                    <div v-else class="bg-slate-50 flex flex-col border-t-[0.05rem] w-full text-xs p-1 border-slate-300 space-y-1">
                        <div class="px-2 py-1 flex flex-col justify-around" v-for="(item, index) in barStore.fetchednf" :key="index">
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
                </Transition> -->
            <!-- </div>  -->
        </div>
        <div class="flex flex-col w-full h-full justify-start items-center rounded-sm">
            <table class="bg-slate-100 flex flex-col w-full rounded-sm shadow-sm border-slate-600">
                <thead class="flex">
                    <tr class="w-full bg-slate-600 flex flex-row px-4 py-3 text-slate-100">
                        <th class="w-3/12 text-start">ID</th>
                        <th class="w-8/12 text-start">Rastreio</th>
                        <th class="ml-auto text-start">Ações</th>
                    </tr>
                </thead>
                <tbody class="flex flex-col h-56 overflow-scroll">
                    <tr v-for="(item, index) in fetchedTrack" :key="index" class="flex flex-row w-full text-sm text-start px-4 py-3 tracking-tighter font-normal"  >
                        <td class="w-3/12">{{ item.idrastreio }}</td>
                        <td class="w-8/12">{{ item.rastreio }}</td>
                        <td class="w-1/12 flex justify-end">
                            <button @click="openSure(item.idrastreio)">
                               <i class="fas fa-trash-can text-lg"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mt-auto"></div>
        <footer class="flex flex-row justify-center w-full rounded-sm fixed bottom-0 bg-stout-gray p-1 shadow-inner">
            <button  class=" text-slate-100 rounded-l-sm mt-auto py-2 h-12 w-full bg-slate-500"> 
                <span class="capitalize font-medium tracking-tighter">finalizar</span>
            </button>
            <button class="bg-slate-500 text-slate-100 rounded-r-sm mt-auto py-2 h-12 w-full"> 
                <span class="capitalize font-medium tracking-tighter" @click="goBack">retornar</span>
            </button>
        </footer>
        <Teleport to="body">
            <Transition name="page-slide" mode="out-in">
                <div class="flex flex-row items-center justify-center fixed top-0 w-full h-full backdrop-blur-sm z-40" v-if="sureToDelete">
                    <div class=" bg-slate-50 px-4 py-2 shadow-md w-10/12" >
                        <header class="w-full flex flex-col items-start">
                            <div class="flex flex-row w-full">
                                <span class="capitalize text-2xl tracking-tighter font-semibold">tem certeza?</span>
                                <button class="ml-auto flex flex-col items-center justify-center " @click="sureToDelete=false">
                                    <i class="fas fa-xmark text-lg"></i>
                                </button>
                            </div>
                            <div class="w-10/12 flex flex-wrap -mt-1">
                                <span class="text-xs capitalize text-red-700 font-medium tracking-tighter">não é possível desfazer a exclusão</span>
                            </div>
                        </header>
                        <main class="flex flex-row py-2 mt-6">
                            <MainButton title="" customClass="bg-red-800 rounded-l-sm h-12" @click="deleteTrack()">
                                <template #free-area>
                                    <Transition name="fade-slide" mode="out-in">
                                        <div v-if="!deleting">
                                            <span class="capitalize font-medium tracking-tighter">Confirmar</span>
                                        </div>
                                        <div class="flex flex-row justify-center space-x-1 items-center" v-else>
                                            <i class="fas fa-circle-notch fa-spin text-sm text-slate-100"></i>
                                            <span class="capitalize font-medium tracking-tighter">Excluindo</span>
                                        </div>
                                    </Transition>
                                </template>
                            </MainButton>
                            <MainButton title="cancelar" customClass="bg-slate-700 rounded-r-sm h-12" @click="sureToDelete=false"/>
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
        transition: 100ms ease all;
    }

    .page-slide-enter-from,
    .page-slide-leave-to {
        opacity: 0;
        -webkit-transform: scale(1.05);
        transform: scale(1.05);
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.1s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    .fade-slide-enter-active,
    .fade-slide-leave-active {
        transition: 100ms ease all
    }

    .fade-slide-enter-from,
    .fade-slide-leave-to {
        opacity: 0;
    }
</style>