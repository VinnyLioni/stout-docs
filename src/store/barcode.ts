import { defineStore } from "pinia";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import axios from "axios";

export const useBarStore = defineStore("barStore", () => {
  const toast = useToast();

  const codebar = ref<any>();
  const objcode = ref<any>();
  const numbernf = ref<any>();
  const codeHistory = ref<Array<any>>([]);

  const startDate = ref<any>();
  const endDate = ref<any>();

  type ToastType = "success" | "error" | "info" | "warning";

  const showToast = (type: ToastType, message: string) => {
    toast[type](message);
  };

  const fetchednf = ref<any>();
  const clearednf = ref<any>();

  const fetchNfData = async (payload: string) => {
    isLoading(true);
    try {
      const result = await axios.get(
        `https://teste.notabrasil.com.br/htdremoto/jbf/rastreio/nf/chave/${payload}`
      );
      const mappedNf = result.data.items.map((item: NFItem) => ({
        cnpjcpf: item.cnpjcpf,
        dt: item.dt,
        fantasia: item.fantasia,
        idnfsai: item.idnfsai,
        nfechave: item.nfechave,
        nome: item.nome,
        doc: item.doc,
        countrastreios: item.listrastreios,
      }));
      if (mappedNf.length >= 1) {
        console.log(mappedNf);
        fetchednf.value = mappedNf;
        numbernf.value = mappedNf.length > 0 ? mappedNf[0].idnfsai : null;
        showToast("success", `Nota ${payload} localizada.`);
      } else {
        showToast("error", `Nota ${payload} não existente na base.`);
      }
    } catch (error: any) {
      showToast("error", error);
      return;
    } finally {
      isLoading(false);
    }
  };

  const clearData = () => {
    fetchednf.value = clearednf.value;
    allNotes.value = clearednf.value;
  };

  const loading = ref<boolean>(false);

  const isLoading = (payload: boolean) => {
    loading.value = payload;
  };

  const allNotes = ref<any>();

  interface NFItem {
    cnpjcpf: string;
    dt: string;
    fantasia: string;
    idnfsai: number;
    nfechave: string;
    nome: string;
    doc: string;
    countrastreios: number;
    listrastreios: number;
  }

  const fetchAllNotes = async (startDate: string, endDate: string) => {
    isLoading(true);
    try {
      const result = await axios.get(
        `https://teste.notabrasil.com.br/htdremoto/jbf/rastreio/nf/list?startDate=${startDate}&endDate=${endDate}`
      );
      const fetchedData: NFItem[] = result.data.items.map((item: NFItem) => ({
        cnpjcpf: item.cnpjcpf,
        dt: item.dt,
        fantasia: item.fantasia,
        idnfsai: item.idnfsai,
        nfechave: item.nfechave,
        nome: item.nome,
        doc: item.doc,
        countrastreios: item.countrastreios,
      }));

      console.log(fetchedData);
      const filtrados = fetchedData.filter(
        (item: NFItem) =>
          item.dt.substring(0, 10) >= startDate &&
          item.dt.substring(0, 10) <= endDate
      );
      allNotes.value = filtrados;
    } catch (error: any) {
      if (error.response) {
        console.error(
          "Erro ao receber resposta do servidor:",
          error.response.status
        );
        showToast(
          "error",
          `Erro ao receber resposta do servidor. ${error.response.status}`
        );
      } else if (error.request) {
        console.error("Não houve resposta do servidor:", error.request);
        showToast("error", `Não houve resposta do servidor. ${error.request}`);
      } else {
        console.error("Erro ao configurar a solicitação:", error.message);
        showToast(
          "error",
          `Erro ao configurar a solicitação. ${error.message}`
        );
      }
    } finally {
      isLoading(false);
    }
  };

  interface NFRastreio<T extends { id: number }> {
    nfechave: number;
    idnfsai: number;
    listrastreios: T[];
  }

  const fetchedTrack = ref<any>();
  const fetchTracker = async <T extends { id: number; idrastreio: number }>(
    payload: string
  ): Promise<void> => {
    try {
      const tracker = await axios.get(
        `https://teste.notabrasil.com.br/htdremoto/jbf/rastreio/nf/chave/${payload}`
      );
      const mappedTrack: NFRastreio<T>[] = tracker.data.items.map(
        (item: NFRastreio<T>) => ({
          nfechave: item.nfechave,
          idnfsai: item.idnfsai,
          listrastreios: item.listrastreios,
        })
      );

      const listrastreios: T[] = mappedTrack
        .map((item) => item.listrastreios)
        .flat();
      fetchedTrack.value = listrastreios;
      fetchedTrack.value = fetchedTrack.value.sort(
        (a: T, b: T) => a.idrastreio - b.idrastreio
      );
      console.log("ordenado", fetchedTrack.value);
    } catch (e) {
      console.error(e);
    }
  };

  interface TrackData {
    idrastreio: number | null;
    idnfsai: number;
    rastreio: string;
  }

  const createTrack = async (payload: TrackData) => {
    try {
      const response = await axios.post(
        `https://teste.notabrasil.com.br/htdremoto/jbf/rastreio/objeto/`,
        payload
      );
      return response.data;
    } catch (error: any) {
      showToast("error", `Erro ao vincular objeto a nota. ${error.message}`);
      throw error;
    }
  };

  const wipeTrack = async (payload: number) => {
    try {
      await axios.delete(
        `https://teste.notabrasil.com.br/htdremoto/jbf/rastreio/objeto/${payload}`
      );
      showToast("success", `Rastreio ${payload} excluído com sucesso.`);
    } catch (error: any) {
      showToast("error", `Erro ao excluir rastreio. ${error.message}`);
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
    allNotes,
    fetchTracker,
    fetchedTrack,
    createTrack,
    numbernf,
    objcode,
    wipeTrack,
    loading,
    startDate,
    endDate,
  };
});
