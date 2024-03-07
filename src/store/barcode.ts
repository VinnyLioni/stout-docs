import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

export const useBarStore = defineStore('barStore', () => {

    
    const toast = useToast()

    const codebar = ref<any>()
    const objcode = ref<any>()
    const numbernf=ref<any>()
    const codeHistory = ref<Array<any>>([])

    type ToastType = 'success' | 'error' | 'info' | 'warning';

    const showToast = (type: ToastType, message: string) => {
        toast[type](message);
    }

    const fetchednf = ref<any>()
    const clearednf = ref<any>()

    const fetchNfData = async (payload: string) => {
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
            fetchednf.value = mappedNf
            numbernf.value = mappedNf.length > 0 ? mappedNf[0].idnfsai : null;

        } catch (error) {
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

        } catch(error: any) {
            if (error.response) {
                console.error("Erro ao receber resposta do servidor:", error.response.status);
                showToast('error', `Erro ao receber resposta do servidor. ${error.response.status}`)
            } else if (error.request) {
                console.error("Não houve resposta do servidor:", error.request);
                showToast('error', `Não houve resposta do servidor. ${error.request}`)
            } else {
                console.error("Erro ao configurar a solicitação:", error.message);
                showToast('error', `Erro ao configurar a solicitação. ${error.message}`)
            }
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
          const response = await axios.post(`http://htd-remoto.ddns.net:1049/ords/jbf/rastreio/objeto/`, payload);
          return response.data
        } catch (error: any) {
          showToast('error', `Erro ao vincular objeto a nota. ${error.message}`)
          throw error
      };
    }

    const wipeTrack = async (payload: number) => {
        try {
            await axios.delete(`http://htd-remoto.ddns.net:1049/ords/jbf/rastreio/objeto/${payload}`)
            showToast('success', `Rastreio ${payload} excluído com sucesso.`)
        } catch(error: any) {
            showToast('error', `Erro ao excluir rastreio. ${error.message}`)
        }
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
        numbernf,
        objcode,
        wipeTrack
    }
})