<script setup lang="ts">
import { onMounted } from 'vue';
import { useBarStore } from '../store/barcode';

    const barStore = useBarStore()

    onMounted(() => {
        barStore.fetchAllNotes()
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString()
    }
</script>

<template>
    <div class="w-full h-full flex flex-col items-center justify-start">
        <header class="w-full">
            <div class="flex flex-row items-center py-3 justify-center text-slate-800">
                <i class="fas fa-barcode text-lg"></i>
                <span class="ml-2 text-lg font-semibold tracking-tighter capitalize">notas fiscais emitidas hoje</span>
            </div>
        </header>
        <main class="w-full flex flex-col items-center">
            <div v-if="barStore.allNotes" class="bg-slate-100 flex flex-col w-full text-xs border-[1px] rounded-sm m-1 shadow-md border-slate-600" v-for="(item, index) in barStore.allNotes" :key="index">
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
    </div>
</template>