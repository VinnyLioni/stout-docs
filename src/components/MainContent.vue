<script setup lang="ts">
    import BarCode from './layout/BarCode.vue';
    // import BarCode2 from './layout/BarCode2.vue';

</script>

<template>
    <div class="">
        <div class="bg-slate-100 shadow-md px-2">
            <div class="flex flex-row items-center py-6 justify-center text-slate-800">
                <i class="fas fa-barcode text-lg"></i>
                <span class="ml-2 text-lg font-semibold tracking-tighter">Leitor de Código de Barras</span>
            </div>
            <div class="flex flex-col items-around pb-10 justify-center">
                <BarCode />
                <!-- <BarCode2 /> -->
            </div>
        </div>
    </div>
</template>