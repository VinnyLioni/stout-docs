import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

export const useBarStore = defineStore('barStore', () => {
    const toast = useToast()

    const codebar = ref<any>()
    const codeHistory = ref<Array<any>>([])

    type ToastType = 'success' | 'error' | 'info' | 'warning';

    const showToast = (type: ToastType, message: string) => {
        toast[type](message);
    }
    return {
        codebar,
        codeHistory,
        showToast
    }
})