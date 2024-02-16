<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import { QrcodeStream  } from 'vue-qrcode-reader'
    import { useBarStore } from '../../store/barcode'

    const barStore = useBarStore()
      
    const onDetect = (detectedCodes: any) => {
        if (detectedCodes.length > 0) {
            const firstCode = detectedCodes[0].rawValue
            barStore.codebar=firstCode
        } else {
            barStore.codebar=''
        }
    }
    
    const selectedDevice = ref<any>(null)
    const devices = ref<any>([])
    // const changeCamera = ref<boolean>(false)

    // const selectedDevice = ref<any>(null)
    // const frontCameras = ref<any[]>([])
    // const backCameras = ref<any[]>([])
    // const error = ref('')
    // const facingMode = ref<'user' | 'environment'>('environment')

    // const facingMode = ref('environment')

    // const switchCamera = () => {
    //     switch (facingMode.value) {
    //         case 'environment': facingMode.value='user'
    //             break
    //         case 'user': facingMode.value='environment'
    //             break
    //     }
    // }
    
    // onMounted(async () => {
    //     try {
    //     const mediaDevices = await navigator.mediaDevices.enumerateDevices()
    //     console.log(mediaDevices)
    //     mediaDevices.forEach(device => {
    //         if (device.kind === 'videoinput') {
    //             if (device.label.toLowerCase().includes('front')) {
    //                 frontCameras.value.push(device)
    //                 console.log('frontais', device)
    //             } else if (device.label.toLowerCase().includes('back')) {
    //                 backCameras.value.push(device)
    //                 console.log('traseiras', device)
    //             }
    //         }
    //     })
    //     // Selecionar uma câmera padrão
    //     if (frontCameras.value.length > 0) {
    //         selectedDevice.value = frontCameras.value[0]
    //     } else if (backCameras.value.length > 0) {
    //         selectedDevice.value = backCameras.value[0]
    //     }
    // } catch (err: any) {
    //     error.value = 'Erro ao enumerar dispositivos: ' + err.message
    // }
    // })

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

    // onMounted(async () => {
    //     const mediaDevices = await navigator.mediaDevices.enumerateDevices()
    //     const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput')

    //     videoDevices.forEach((device, index) => {
    //         // Aqui você pode definir um nome personalizado para o dispositivo com base em suas características
    //         const customName = `Camera ${index + 1}`
    //         devices.value.push({ ...device, customName })
    //     })

    //     if (devices.value.length > 0) {
    //         selectedDevice.value = devices.value[0]
    //         console.log(devices.value)
    //     }

    //     if (devices.value.length > 1) {
    //         selectedDevice.value = devices.value[3]
    //     }
    // })
      
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
        aztec: true,
        code_128: true,
        code_39: true,
        code_93: true,
        codabar: true,
        databar: true,
        databar_expanded: true,
        data_matrix: true,
        dx_film_edge: true,
        ean_13: true,
        ean_8: true,
        itf: true,
        maxi_code: true,
        micro_qr_code: true,
        pdf417: true,
        qr_code: true,
        rm_qr_code: true,
        upc_a: true,
        upc_e: true,
        linear_codes: true,
        matrix_codes: true
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
    <select v-model="selectedDevice" class="p-4 w-full bg-slate-600 text-slate-100 font-semibold tracking-tighter rounded-sm outline-none duration-200 ease-in-out">
        <option v-for="device in devices" :key="device.label" :value="device" class="text-center">
            {{ `Camera ${device.index + 1}` }}
        </option>
    </select>  
      <p class="error">{{ error }}</p>
      <div class="w-full min-h-96 flex flex-col justify-center items-center overflow-hidden">
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
    </div>
  </template>