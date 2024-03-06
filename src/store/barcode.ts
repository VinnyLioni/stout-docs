import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

export const useBarStore = defineStore('barStore', () => {

    
    const toast = useToast()

    const codebar = ref<any>()
    const numbernf=ref<any>()
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
            numbernf.value=fetchednf.value[0].idnfsai

            console.log(numbernf.value, 'idnfsai')
            console.log(fetchednf.value)
            console.log(result)
        } catch(error) {
            console.error(error)
        } finally {
        }
    }

    const clearData = () => {
        fetchednf.value=clearednf.value
        allNotes.value=clearednf.value
    }

    const loading = ref<boolean>(false)

    const isLoading = (payload: boolean) => {
        loading.value = payload
    }

    const allNotes = ref<any>()

    interface NFItem {
        cnpjcpf: string,
        dt: string,
        fantasia: string,
        idnfsai: number,
        nfechave: string,
        nome: string
    }

    const fetchAllNotes = async (startDate: string, endDate: string) => {
        isLoading(true);
        try {
            const result = await axios.get(`http://htd-remoto.ddns.net:1049/ords/jbf/rastreio/nf/list?startDate=${startDate}&endDate=${endDate}`);
            const fetchedData: NFItem[] = result.data.items.map((item: NFItem) => ({
                cnpjcpf: item.cnpjcpf,
                dt: item.dt,
                fantasia: item.fantasia,
                idnfsai: item.idnfsai,
                nfechave: item.nfechave,
                nome: item.nome
            }));
    
            const filtrados = fetchedData.filter((item: NFItem) => item.dt.substring(0, 10) >= startDate && item.dt.substring(0, 10) <= endDate);
            allNotes.value = filtrados;
            console.log(allNotes.value);
            console.log(filtrados);
        } catch(e) {
            console.error(e);
        } finally {
            isLoading(false);
        }
    };

    interface NFRastreio<T> {
        nfechave: number,
        idnfsai: number,
        listrastreios: T[]
    }
    const fetchedTrack = ref<any>()
    const fetchTracker = async <T>(payload: string): Promise<void> => {
        try {
            const tracker = await axios.get(`http://htd-remoto.ddns.net:1049/ords/jbf/rastreio/nf/chave/${payload}`);
            const mappedTrack: NFRastreio<T>[] = tracker.data.items.map((item: NFRastreio<T>) => ({
                nfechave: item.nfechave,
                idnfsai: item.idnfsai,
                listrastreios: item.listrastreios
            }));
            
            const listrastreios: T[] = mappedTrack.map(item => item.listrastreios).flat();
            fetchedTrack.value = listrastreios;
            
            console.log('rastreios', fetchedTrack.value, payload);
        } catch(e) {
            console.error(e);
        }
    }

    interface TrackData {
        idrastreio: number | null;
        idnfsai: number;
        rastreio: string;
    }

    const createTrack = async (payload: TrackData) => {
        try {
          const response = await axios.post(`http://htd-remoto.ddns.net:1049/ords/jbf/rastreio/objeto`, payload);
          console.log('Objeto vinculado à nota fiscal criado com sucesso:', response.data)
          return response.data
        } catch (error) {
          console.error('Erro ao adicionar objeto vinculado à nota fiscal:', error)
          throw error
      };
    }
 
    return {
        codebar,
        codeHistory,
        showToast,
        fetchNfData,
        fetchednf,
        clearData,
        clearednf,
        fetchAllNotes,
        allNotes,
        fetchTracker,
        fetchedTrack, 
        createTrack,
        numbernf
    }
})