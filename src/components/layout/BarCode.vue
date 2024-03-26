<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import { QrcodeStream  } from 'vue-qrcode-reader'
    import { useBarStore } from '../../store/barcode'

    const barStore = useBarStore()

    const newCodeInserted = ref<boolean>(false)

    const emits = defineEmits(['codeDetected'])

    const clearNewCodeInserted = () => {
        setTimeout(() => {
            newCodeInserted.value=false
        }, 1000)
    }
      
    const onDetect = (detectedCodes: any) => {
        if (detectedCodes.length > 0) {
            const firstCode = detectedCodes[0].rawValue
            barStore.codebar = firstCode
            barStore.codeHistory.unshift(firstCode)
            newCodeInserted.value=true
            clearNewCodeInserted()
            emits('codeDetected', firstCode)
        } else {
            barStore.codebar=''
        }
    }

    const facingMode = ref<any>('environment')
    const switchCamera = () => {
        loading.value=true
        switch (facingMode.value) {
            case 'environment': facingMode.value='user'
            break
            case 'user': facingMode.value='environment'
            break
        }
    }
    
    const selectedDevice = ref<any>(null)
    const devices = ref<any>([])
    const allDevices = ref<any>([])

    onMounted(async () => {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput')

        allDevices.value=await navigator.mediaDevices.enumerateDevices()

        videoDevices.forEach((device: any, index) => {
            ;;
            device.index = index
            devices.value.push(device)
        })

        if (devices.value.length > 0) {
            selectedDevice.value = devices.value[0]
        }

        if (devices.value.length > 1) {
            selectedDevice.value = devices.value[devices.value.length - 1]
        }
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
        error.value += 'Dê as permissões para o navegador acessar a câmera'
        } else if (err.name === 'NotFoundError') {
        error.value += 'Não há cameras disponíveis no dispositivo'
        } else if (err.name === 'NotSupportedError') {
        error.value += 'Acesso seguro necessário (HTTPS, localhost)'
        } else if (err.name === 'NotReadableError') {
        error.value += 'A Camera já está em uso?'
        } else if (err.name === 'OverconstrainedError') {
        error.value += 'As câmeras não são utlizáveis.'
        } else if (err.name === 'StreamApiNotSupportedError') {
        error.value += 'Esse navegador não suporta essa função.'
        } else if (err.name === 'InsecureContextError') {
        error.value +=
            'Acesso à câmera é permitido apenas em contexto seguro. Utilize HTTPS ou localhost em vez de HTTP.'
        } else {
        error.value += err.message
        }
    }

    const loading = ref<boolean>(true)

    const loadingCamera = () => {
        loading.value = false
    }

</script>

<template>
    <div class="flex flex-col justify-center items-center w-screen">
        <p class="error">{{ error }}</p>
        <div class="relative h-52 flex flex-col justify-start items-center overflow-hidden border-solid border-slate-600 shadow-md w-full duration-200">
            <button @click="switchCamera" :class="loading ? 'text-slate-800' : ''" class="absolute text-slate-100 z-20 duration-200 rounded-full right-6 top-6">
                <i class="fas fa-camera-rotate text-2xl"></i>
            </button>
            <qrcode-stream
                :constraints="{ deviceId: selectedDevice.deviceId, facingMode }"
                :track="trackFunctionSelected.value"
                :formats="selectedBarcodeFormats"
                @error="onError"
                @detect="onDetect"
                @camera-on="loadingCamera"
                v-if="selectedDevice !== null"
            >
                <transition name="page-slide" mode="out-in">
                    <div v-if="loading" class="text-slate-800 flex flex-row justify-center items-center h-full bg-stout-gray">
                        <i class="fas fa-circle-notch fa-spin text-5xl"></i>
                    </div>
                </transition>
            </qrcode-stream>
            <p v-else class="text-red-800 flex w-full h-full items-center justify-center text-center">
                Não há Câmeras disponíveis nesse dispositivo.
            </p>
        </div>
    </div>
</template>

<style>
    .page-slide-enter-active,
    .page-slide-leave-active {
        transition: 300ms ease all;
    }

    .page-slide-enter-from,
    .page-slide-leave-to {
        opacity: 0;
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>