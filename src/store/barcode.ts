import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBarStore = defineStore('barStore', () => {
    const codebar = ref<any>()

    return {
        codebar
    }
})