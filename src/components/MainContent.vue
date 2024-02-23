<script setup lang="ts">
    import { useBarStore } from '../store/barcode';
    import BarCode from './layout/BarCode.vue';
    // import CaptureCode from './layout/CaptureCode.vue'

    const barStore = useBarStore()

</script>

<template>
    <div class="">
        <div class="bg-slate-100 shadow-md px-2">
            <div class="flex flex-row items-center py-6 justify-center text-slate-800">
                <i class="fas fa-barcode text-lg"></i>
                <span class="ml-2 text-lg font-semibold tracking-tighter">Leitor de Código de Barras</span>
            </div>
            <div class="flex flex-col items-around pb-10 justify-center">
                <!-- <div class="flex flex-col text-sm">
                    <span>Último lido</span>
                    <input type="text" disabled class="h-12 outline-1
                    w-auto outline-none border-b border-pure-white rounded-md shadow-gataticos-shadow
                    focus:border focus:border-slate-600 ease-in-out duration-200
                    " v-model="barStore.codebar">
                </div> -->
                <BarCode />
            </div>
        </div>
    </div>
</template>