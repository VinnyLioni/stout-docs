import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

export const useBarStore = defineStore('barStore', () => {
    interface NFItem {
        cnpjcpf: string,
        dt: string,
        fantasia: string,
        idnfsai: number,
        nfechave: string,
        nome: string
    }
    
    const toast = useToast()

    const codebar = ref<any>()
    const codeHistory = ref<Array<any>>([])

    type ToastType = 'success' | 'error' | 'info' | 'warning';

    const showToast = (type: ToastType, message: string) => {
        toast[type](message);
    }

    const fetchednf = ref<any>()
    const clearednf = ref<any>()

    const fetchNfData =async  (payload: string) => {
        try {
            const result = await axios.get(`http://htd-remoto.ddns.net:1049/ords/jbf/rastreio/nf/chave/${payload}`)
            const mappedNf = result.data.items.map((item: NFItem) => ({
                cnpjcpf: item.cnpjcpf,
                dt: item.dt,
                fantasia: item.fantasia,
                idnfsai: item.idnfsai,
                nfechave: item.nfechave,
                nome: item.nome
            }))
            fetchednf.value=mappedNf
            console.log(fetchednf.value)
        } catch(error) {
            console.error(error)
        }
    }

    const clearData = () => {
        fetchednf.value=clearednf.value
    }

    const loading = ref<boolean>(false)

    const isLoading = (payload: boolean) => {
        loading.value=payload
    }

    const allNotes = ref<any>()

    const fetchAllNotes = async () => {
        isLoading(true);
        try {
            const result = await axios.get('http://htd-remoto.ddns.net:1049/ords/jbf/rastreio/nf/list');
            const fetchedData = result.data.items.map((item: NFItem) => ({
                cnpjcpf: item.cnpjcpf,
                dt: item.dt,
                fantasia: item.fantasia,
                idnfsai: item.idnfsai,
                nfechave: item.nfechave,
                nome: item.nome
            }));
    
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            const actualDate = `${year}-${month}-${day}`;
    
            const filtrados = fetchedData.filter(item => item.dt.substring(0, 10) === actualDate);
            allNotes.value = filtrados;
            console.log(allNotes.value);
            console.log(filtrados);
        } catch(e) {
            console.error(e);
        } finally {
            isLoading(false);
        }
    };
 
    return {
        codebar,
        codeHistory,
        showToast,
        fetchNfData,
        fetchednf,
        clearData,
        clearednf,
        fetchAllNotes,
        allNotes
    }
})