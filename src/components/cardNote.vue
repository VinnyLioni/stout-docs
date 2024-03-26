<script setup lang="ts">
defineProps({
  allItens: Object,
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const emit = defineEmits(['customFunction'])

const customFunction = (nfechave: string, idnfsai: string) => {
  emit('customFunction', nfechave, idnfsai)
  console.log(customFunction)
}
</script>

<template>
  <div
    class="bg-slate-50 flex flex-col border-t-[0.05rem] w-full text-xs p-1 border-slate-300 space-y-1"
    v-for="(item, index) in allItens"
    :key="index"
    @click="customFunction(item.nfechave, item.idnfsai)"
  >
    <div class="px-2 py-1 flex flex-col justify-around">
      <header class="flex flex-row w-full">
        <div class="flex flex-row items-baseline w-8/12">
          <span
            class="font-medium tracking-tighter overflow-hidden whitespace-nowrap max-w-full truncate"
            >{{ item.fantasia }}</span
          >
        </div>
        <div class="ml-auto">
          <span>{{ formatDate(item.dt) }}</span>
        </div>
      </header>
      <div class="flex flex-row items-baseline w-full">
        <div>
          <span
            class="tracking-tighter ml-auto text-[0.63rem] whitespace-nowrap max-w-full truncate"
            >{{ item.nfechave }}</span
          >
        </div>
        <div class="ml-auto">
          <!-- <span class="mr-1 text-slate-800 font-semibold tracking-tighter">Total:</span> -->
          <span class="text-green-800 font-medium">R$999,99</span>
        </div>
      </div>

      <footer class="flex flex-row w-full">
        <div
          class="flex text-[0.65rem] items-center justify-center text-slate-100 px-[0.25rem] py-[0.125rem] rounded w-16"
          :class="item.countrastreios ? 'bg-green-600' : 'bg-amber-400'"
        >
          <div
            v-if="item.countrastreios > 0"
            class="flex flex-row justify-around w-full"
          >
            <span>{{ item.countrastreios }}</span>
            <span>{{
              item.countrastreios > 1 ? "Rastreios" : "Rastreio"
            }}</span>
          </div>
          <span v-else class="capitalize">pendente</span>
        </div>
        <div class="flex flex-row items-baseline ml-auto">
          <span class="mr-1 text-slate-800 font-semibold tracking-tighter"
            >NF:</span
          >
          <span>{{ item.doc }}</span>
        </div>
      </footer>
    </div>
  </div>
</template>
