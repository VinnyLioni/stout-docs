<script setup lang="ts">
    import { useBarStore } from '../store/barcode';
    import BarCode from './layout/BarCode.vue';
    // import CaptureCode from './layout/CaptureCode.vue'

    const barStore = useBarStore()

</script>

<template>
    <div class="">
        <div class="bg-slate-100 shadow-md px-6 pt-10">
            <div class="flex flex-row items-center">
                <i class="fas fa-barcode text-lg"></i>
                <span class="ml-2 text-lg font-semibold tracking-tighter">Leitura de Código de Barras</span>
            </div>
            <div class="flex flex-col items-around py-6 justify-center">
                <input type="text" disabled class="h-12 mb-4 outline-1 p-2 text-lg
                        mt-1 2xl:mt-2 w-auto outline-none border-b border-pure-white  rounded-md 2xl:p-3 shadow-gataticos-shadow
                        focus:border focus:border-slate-600 ease-in-out duration-200
                " v-model="barStore.codebar">
                <BarCode />
                <!-- <CaptureCode /> -->
            </div>
        </div>
    </div>
</template>