<script setup lang="ts">
    import BarCode from '../components/layout/BarCode.vue';
    import MainButton from '../components/layout/MainButton.vue';            

</script>

<template>
    <div class="bg-slate-100 w-full h-full flex flex-col items-center justify-start">
        <div class="flex flex-row items-center py-3 justify-center text-slate-800">
            <i class="fas fa-barcode text-lg"></i>
            <span class="ml-2 text-lg font-semibold tracking-tighter capitalize">leitor de notas fiscais</span>
        </div>
        <div class="flex flex-col items-center mx-2 justify-center w-full">
            <BarCode />
        </div>
        <div class="flex flex-row mt-auto w-full rounded-sm my-4">
            <MainButton title="identificar pacotes"/>
            <MainButton title="retornar" customClass="bg-slate-600"/>
        </div>
    </div>
</template>