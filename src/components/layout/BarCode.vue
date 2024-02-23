<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import { QrcodeStream  } from 'vue-qrcode-reader'
    import { useBarStore } from '../../store/barcode'

    const barStore = useBarStore()

    const newCodeInserted = ref<boolean>(false)

    const clearNewCodeInserted = () => {
        setTimeout(() => {
            newCodeInserted.value=false
        }, 1000)
    }
      
    const onDetect = (detectedCodes: any) => {
        if (detectedCodes.length > 0) {
            const firstCode = detectedCodes[0].rawValue
            barStore.codebar = firstCode
            console.log('codigos', barStore.codebar)
            barStore.codeHistory.unshift(firstCode)
            newCodeInserted.value=true
            clearNewCodeInserted()
            barStore.showToast('success', `Código ${barStore.codebar} lido com sucesso.`)
            console.log(barStore.codeHistory)
        } else {
            barStore.codebar=''
        }
    }
    
    const selectedDevice = ref<any>(null)
    const devices = ref<any>([])

    onMounted(async () => {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput')

        videoDevices.forEach((device: any, index) => {
            // Adiciona um índice ao objeto do dispositivo
            ;;
            device.index = index
            devices.value.push(device)
        })

        if (devices.value.length > 0) {
            selectedDevice.value = devices.value[0]
        }

        if (devices.value.length > 1) {
            selectedDevice.value = devices.value[3]
        }
        console.log(devices)
    })

    const paintOutline = (detectedCodes: any, ctx: any) => {
        for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints
    
        ctx.strokeStyle = 'red'
    
        ctx.beginPath()
        ctx.moveTo(firstPoint.x, firstPoint.y)
        for (const { x, y } of otherPoints) {
            ctx.lineTo(x, y)
        }
        ctx.lineTo(firstPoint.x, firstPoint.y)
        ctx.closePath()
        ctx.stroke()
        }
    }

    const paintBoundingBox = (detectedCodes: any, ctx: any) => {
        for (const detectedCode of detectedCodes) {
        const {
            boundingBox: { x, y, width, height }
        } = detectedCode
    
        ctx.lineWidth = 2
        ctx.strokeStyle = '#007bff'
        ctx.strokeRect(x, y, width, height)
        }
    }

    const paintCenterText = (detectedCodes: any, ctx: any) => {
        for (const detectedCode of detectedCodes) {
        const { boundingBox, rawValue } = detectedCode
    
        const centerX = boundingBox.x + boundingBox.width / 2
        const centerY = boundingBox.y + boundingBox.height / 2
    
        const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width)
    
        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.textAlign = 'center'
    
        ctx.lineWidth = 3
        ctx.strokeStyle = '#35495e'
        ctx.strokeText(detectedCode.rawValue, centerX, centerY)
    
        ctx.fillStyle = '#5cb984'
        ctx.fillText(rawValue, centerX, centerY)
        }
    }

    const trackFunctionOptions = [
        { text: 'nothing (default)', value: undefined },
        { text: 'outline', value: paintOutline },
        { text: 'centered text', value: paintCenterText },
        { text: 'bounding box', value: paintBoundingBox }
    ]

    const trackFunctionSelected = ref(trackFunctionOptions[1])
  
    const barcodeFormats = ref<any>({
        aztec: false,
        code_128: true,
        code_39: false,
        code_93: false,
        codabar: false,
        databar: false,
        databar_expanded: false,
        data_matrix: false,
        dx_film_edge: false,
        ean_13: true,
        ean_8: false,
        itf: false,
        maxi_code: false,
        micro_qr_code: false,
        pdf417: false,
        qr_code: true,
        rm_qr_code: false,
        upc_a: false,
        upc_e: false,
        linear_codes: false,
        matrix_codes: false
    })

    const selectedBarcodeFormats = computed(() => {
        return Object.keys(barcodeFormats.value).filter((format) => barcodeFormats.value[format])
    })

    const error = ref('')
    
    const onError = (err: any) => {
        error.value = `[${err.name}]: `
    
        if (err.name === 'NotAllowedError') {
        error.value += 'you need to grant camera access permission'
        } else if (err.name === 'NotFoundError') {
        error.value += 'no camera on this device'
        } else if (err.name === 'NotSupportedError') {
        error.value += 'secure context required (HTTPS, localhost)'
        } else if (err.name === 'NotReadableError') {
        error.value += 'is the camera already in use?'
        } else if (err.name === 'OverconstrainedError') {
        error.value += 'installed cameras are not suitable'
        } else if (err.name === 'StreamApiNotSupportedError') {
        error.value += 'Stream API is not supported in this browser'
        } else if (err.name === 'InsecureContextError') {
        error.value +=
            'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
        } else {
        error.value += err.message
        }
    }

</script>

<template>
    <div class="flex flex-col justify-center items-center">
    <select v-model="selectedDevice" class="p-4 w-full bg-slate-600 text-slate-100 font-semibold tracking-tighter rounded-tr-sm rounded-tl-sm outline-none duration-200 ease-in-out">
        <option v-for="device in devices" :key="device.label" :value="device" class="text-center">
            {{ `Camera ${device.index + 1}` }}
        </option>
    </select>  
      <p class="error">{{ error }}</p>
      <div class="w-full min-h-96 flex flex-col justify-start items-center overflow-hidden rounded-bl-sm rounded-br-sm border-solid border-slate-600 border-2">
        <qrcode-stream
          :constraints="{ deviceId: selectedDevice.deviceId }"
          :track="trackFunctionSelected.value"
          :formats="selectedBarcodeFormats"
          @error="onError"
          @detect="onDetect"
          v-if="selectedDevice !== null"
        />
        <p v-else class="text-red-800">
            Não há Câmeras disponíveis nesse dispositivo.
        </p>
        <!-- <button class="p-4 mt-2 w-full bg-slate-600 text-slate-100">Alterar camera</button> -->
      </div>
      <table class="w-full mt-4">
        <thead class="w-full flex">
            <tr class="w-full bg-slate-600 text-slate-100 rounded-tr-sm rounded-tl-sm py-4 flex justify-center">
                <!-- <th class="mr-auto w-2/12">Seq.</th> -->
                <th class="w-full text-sm">Lista de Códigos</th>
            </tr>
        </thead>
        <tbody class="full flex flex-col border-solid border-slate-600 border-[1px] rounded-bl-sm rounded-br-sm">
            <tr v-if="barStore.codeHistory.length <= 0" class="flex justify-center text-sm text-slate-600 py-2">
                <td>Nenhuma leitura feita.</td>
            </tr>
            <tr v-else v-for="(item, index) in barStore.codeHistory" :key="index" class="flex justify-start duration-200 ease-in" :class="newCodeInserted && index === 0 ? 'bg-green-600 text-slate-100' : ''">
                <td class="text-xs px-4 py-2 border-t-2 w-full4">{{ item }}</td>
            </tr>
        </tbody>
      </table>
      <div class="pt-10 w-full flex flex-row justify-center">
        <button class="bg-green-600 text-slate-100 px-6 py-2 rounded-sm font-semibold tracking-tighter w-full">
            Enviar Códigos
        </button>
      </div>
    </div>
  </template>