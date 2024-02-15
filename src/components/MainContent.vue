<script setup lang="ts">

</script>

<template>
    <div class="">
        <div class="bg-slate-100 shadow-md px-6 pt-10">
            <div class="flex flex-row items-center">
                <i class="fas fa-barcode text-lg"></i>
                <span class="ml-2 text-lg font-semibold tracking-tighter">Leitura de Código de Barras</span>
            </div>
            <div class="flex flex-col items-around py-6 justify-center">
                <input type="text" class="h-12 mb-4   outline-1 p-2
                        mt-1 2xl:mt-2 w-auto outline-none border-b border-pure-white 
                        text-xs 2xl:text-lg rounded-md 2xl:p-3 shadow-gataticos-shadow
                        focus:border focus:border-slate-600 ease-in-out duration-200
                ">
                <button class="bg-green-700 text-slate-100 px-6 py-2 font-semibold">Ler Código de Barras</button>
            </div>
            
        </div>
    </div>
</template>