<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import BarCode2 from '../components/layout/BarCode2.vue';
    import MainButton from '../components/layout/MainButton.vue';
    import { useBarStore } from '../store/barcode';
    import { useRoute } from 'vue-router';

    const route = useRoute()
    const barStore = useBarStore()
    const fetchedTrack = ref<any>()

    const selectedRastreio=ref<number>(0)
    const sureToDelete = ref<boolean>(false)
    const openSure = (rastreio: number) => {
        sureToDelete.value=true
        selectedRastreio.value=rastreio
        console.log(selectedRastreio.value)
    }

    const deleteTrack = async () => {
        if (selectedRastreio.value) {
            await barStore.wipeTrack(selectedRastreio.value)
            await loadTracks()
            sureToDelete.value=false
        } else (
            console.log(selectedRastreio.value)
        )
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

    const handleCodeDetected = async () => {
        if (barStore.objcode) {
            const trackData: TrackData = {
                idrastreio: null,
                idnfsai: barStore.numbernf,
                rastreio: barStore.objcode
            };
            await postTrack(trackData);
            console.log(trackData)
            await loadTracks()
        } else {
            console.error("O campo rastreio não está preenchido.");
        }
    }

    const loadTracks = async () => { 
        const numeroNota = route.params.numeroNota;
        if (Array.isArray(numeroNota)) {
            await Promise.all(numeroNota.map(async (numero: string) => {
                await barStore.fetchTracker(numero)
                fetchedTrack.value=barStore.fetchedTrack
                console.log(fetchedTrack.value)
            }))
        } else {
            await barStore.fetchTracker(numeroNota)
            fetchedTrack.value=barStore.fetchedTrack
            console.log(fetchedTrack.value)
        }
    }

    onMounted(async () => {
        await loadTracks()
        console.log(barStore.numbernf)
    })

</script>

<template>
    <div class="bg-slate-200 w-full h-full flex flex-col items-center justify-start">
        <div class="flex flex-row items-center py-3 justify-center text-slate-800">
            <i class="fas fa-barcode text-lg"></i>
            <span class="capitalize tracking-tighter font-semibold text-lg ml-2">identificador de pacotes</span>
        </div>
        <div class="flex flex-col items-center mx-2 justify-center w-full">
            <BarCode2 @codeDetected="handleCodeDetected"/>
        </div>
        <div class="flex flex-col w-full h-full justify-center items-center p-1 rounded-sm">
            <table class="bg-slate-100 flex flex-col w-full border-[1px] rounded-sm m-1 shadow-md border-slate-600">
                <thead class="flex">
                    <tr class="w-full bg-slate-600 flex flex-row px-2 py-3 text-slate-100">
                        <th class="w-3/12 text-start">ID</th>
                        <th class="w-8/12 text-start">Rastreio</th>
                    </tr>
                </thead>
                <tbody class="flex flex-col h-72 overflow-scroll">
                    <tr v-for="(item, index) in fetchedTrack" :key="index" class="flex flex-row w-full text-start px-2 p-1 tracking-tighter font-medium">
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
        <div class="flex flex-row mt-auto w-full rounded-sm my-4">
            <MainButton title="finalizar"/>
            <MainButton title="retornar" customClass="bg-slate-600"/>
        </div>
        <Teleport to="body">
            <Transition name="page-slide" mode="out-in">
                <div class="flex flex-row items-center justify-center fixed top-0 w-full h-full backdrop-blur-sm z-40" v-if="sureToDelete">
                    <div class=" bg-slate-50 px-4 py-2 shadow-md" >
                        <header class="w-full flex flex-col items-start">
                            <div class="flex flex-row w-full">
                                <span class="capitalize text-2xl tracking-tighter font-semibold">tem certeza?</span>
                                <button class="ml-auto flex flex-col items-center justify-center " @click="sureToDelete=false">
                                    <i class="fas fa-xmark text-lg"></i>
                                </button>
                            </div>
                            <div class="w-10/12 flex flex-wrap -mt-1">
                                <span class="text-xs capitalize text-red-700 font-semibold tracking-tighter">não é possível desfazer a exclusão</span>
                            </div>
                        </header>
                        <main class="flex flex-row py-2 mt-6">
                            <MainButton title="confirmar" customClass="bg-red-700 h-12" @click="deleteTrack()" />
                            <MainButton title="cancelar" customClass="bg-slate-700 h-12" @click="sureToDelete=false"/>
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
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>