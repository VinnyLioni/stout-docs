import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

export const useBarStore = defineStore('barStore', () => {
    const toast = useToast()

    const codebar = ref<any>()
    const codeHistory = ref<Array<any>>([])

    const showToast = (type, message) => {
        toast[type](message)
    }

    return {
        codebar,
        codeHistory,
        showToast
    }
})