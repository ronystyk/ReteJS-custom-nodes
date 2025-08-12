import { ref, onMounted, onBeforeMount } from 'vue'

export function usePerformanceMetrics() {
    const startTime = ref(performance.now())
    const initTime = ref(0)
    const loading = ref(true)
    const paneReadyTime = ref(0)
    const totalAppTime = ref(0)
    const memoryUsage = ref('N/A')
    const memoryInfo = ref({})
    const cpuInfo = ref({})
    const gpuInfo = ref({})
    const performanceMetrics = ref({})
    
    // Nuevas métricas de consumo real
    const cpuUsage = ref(0)
    const gpuUsage = ref(0)
    const frameTime = ref(0)
    const lastFrameTime = ref(performance.now())

    // Función para medir el uso de CPU
    const measureCPUUsage = () => {
        const start = performance.now()
        
        // Realizar trabajo intensivo para medir CPU
        let result = 0
        for (let i = 0; i < 1000000; i++) {
            result += Math.sqrt(i) * Math.sin(i)
        }
        
        const end = performance.now()
        const cpuTime = end - start
        
        // Calcular porcentaje de uso basado en el tiempo de procesamiento
        // Un valor más alto indica más uso de CPU
        const usage = Math.min(100, (cpuTime / 10) * 100)
        
        return {
            usage: Math.round(usage),
            processingTime: cpuTime.toFixed(2),
            benchmark: result
        }
    }

    // Función para medir el uso de GPU
    const measureGPUUsage = () => {
        try {
            const canvas = document.createElement('canvas')
            canvas.width = 256
            canvas.height = 256
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            
            if (!gl) {
                return { usage: 0, error: 'WebGL no disponible' }
            }
            
            const start = performance.now()
            
            // Crear shaders para medir rendimiento GPU
            const vertexShader = gl.createShader(gl.VERTEX_SHADER)
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
            
            gl.shaderSource(vertexShader, `
                attribute vec2 position;
                void main() {
                    gl_Position = vec4(position, 0.0, 1.0);
                }
            `)
            
            gl.shaderSource(fragmentShader, `
                precision mediump float;
                uniform float time;
                void main() {
                    vec2 uv = gl_FragCoord.xy / 256.0;
                    float color = sin(uv.x * 10.0 + time) * cos(uv.y * 10.0 + time);
                    gl_FragColor = vec4(color, color, color, 1.0);
                }
            `)
            
            gl.compileShader(vertexShader)
            gl.compileShader(fragmentShader)
            
            const program = gl.createProgram()
            gl.attachShader(program, vertexShader)
            gl.attachShader(program, fragmentShader)
            gl.linkProgram(program)
            gl.useProgram(program)
            
            // Crear geometría
            const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
            const buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
            
            const positionLocation = gl.getAttribLocation(program, 'position')
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            
            const timeLocation = gl.getUniformLocation(program, 'time')
            
            // Renderizar múltiples frames para medir rendimiento
            let frameCount = 0
            const maxFrames = 100
            
            const renderFrame = () => {
                gl.uniform1f(timeLocation, performance.now() * 0.001)
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
                frameCount++
                
                if (frameCount < maxFrames) {
                    requestAnimationFrame(renderFrame)
                } else {
                    const end = performance.now()
                    const gpuTime = end - start
                    
                    // Calcular uso de GPU basado en tiempo de renderizado
                    const usage = Math.min(100, (gpuTime / 50) * 100)
                    
                    gpuUsage.value = Math.round(usage)
                    gpuInfo.value.gpuUsage = Math.round(usage)
                    gpuInfo.value.renderTime = gpuTime.toFixed(2)
                    gpuInfo.value.framesRendered = frameCount
                }
            }
            
            renderFrame()
            
        } catch (error) {
            console.warn('Error al medir GPU:', error)
            return { usage: 0, error: error.message }
        }
    }

    // Función para medir FPS y tiempo de frame
    const measureFramePerformance = () => {
        const currentTime = performance.now()
        const deltaTime = currentTime - lastFrameTime.value
        
        frameTime.value = deltaTime
        lastFrameTime.value = currentTime
        
        // Calcular FPS
        const fps = 1000 / deltaTime
        performanceMetrics.value.fps = Math.round(fps)
        performanceMetrics.value.frameTime = deltaTime.toFixed(2)
        
        // Usar requestAnimationFrame para continuar midiendo
        requestAnimationFrame(measureFramePerformance)
    }

    // Función para obtener información del CPU
    const getCPUInfo = () => {
        const info = {}
        
        // Número de núcleos lógicos
        if (navigator.hardwareConcurrency) {
            info.cores = navigator.hardwareConcurrency
        }
        
        // Información del dispositivo
        if (navigator.userAgent) {
            info.userAgent = navigator.userAgent
        }
        
        // Plataforma
        if (navigator.platform) {
            info.platform = navigator.platform
        }
        
        // Medir uso actual de CPU
        const cpuMetrics = measureCPUUsage()
        info.usage = cpuMetrics.usage
        info.processingTime = cpuMetrics.processingTime
        
        return info
    }

    // Función para obtener información del GPU
    const getGPUInfo = () => {
        const info = {}
        
        try {
            const canvas = document.createElement('canvas')
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
                if (debugInfo) {
                    info.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
                    info.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
                }
                
                info.webglVersion = gl.getParameter(gl.VERSION)
                info.shadingLanguageVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
                
                // Capacidades del GPU
                info.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)
                info.maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS)
                info.maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)
                
                // Medir uso actual de GPU
                measureGPUUsage()
            }
        } catch (error) {
            console.warn('No se pudo obtener información del GPU:', error)
        }
        
        return info
    }

    // Función para obtener métricas de rendimiento del sistema
    const getPerformanceMetrics = () => {
        const metrics = {}
        
        // Información de la pantalla
        if (window.screen) {
            metrics.screenWidth = window.screen.width
            metrics.screenHeight = window.screen.height
            metrics.colorDepth = window.screen.colorDepth
            metrics.pixelDepth = window.screen.pixelDepth
        }
        
        // Información de la ventana
        if (window.innerWidth && window.innerHeight) {
            metrics.viewportWidth = window.innerWidth
            metrics.viewportHeight = window.innerHeight
        }
        
        // Métricas de rendimiento del navegador
        if (performance.getEntriesByType) {
            const navigationEntries = performance.getEntriesByType('navigation')
            if (navigationEntries.length > 0) {
                const nav = navigationEntries[0]
                metrics.domContentLoaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart
                metrics.loadComplete = nav.loadEventEnd - nav.loadEventStart
            }
        }
        
        return metrics
    }

    // Función para obtener información detallada de memoria
    const getMemoryInfo = () => {
        const info = {}
        
        // Chrome/Edge - performance.memory
        if (performance.memory) {
            info.used = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
            info.total = (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)
            info.limit = (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)
            info.source = 'Chrome/Edge'
        }
        // Firefox - navigator.memory
        else if (navigator.memory) {
            info.used = (navigator.memory.used / 1024 / 1024).toFixed(2)
            info.total = (navigator.memory.total / 1024 / 1024).toFixed(2)
            info.source = 'Firefox'
        }
        // Fallback - deviceMemory
        else if (navigator.deviceMemory) {
            info.available = `${navigator.deviceMemory}GB`
            info.source = 'Device Memory'
        }
        
        return info
    }

    // Función para obtener uso de memoria (formato simple)
    const getMemoryUsage = () => {
        const info = getMemoryInfo()
        
        if (info.used) {
            return info.used
        } else if (info.available) {
            return info.available
        }
        
        return 'N/A'
    }

    // Función para actualizar métricas de memoria
    const updateMemoryMetrics = () => {
        memoryInfo.value = getMemoryInfo()
        memoryUsage.value = getMemoryUsage()
    }

    // Función para actualizar métricas de CPU y GPU
    const updateHardwareMetrics = () => {
        cpuInfo.value = getCPUInfo()
        gpuInfo.value = getGPUInfo()
        performanceMetrics.value = getPerformanceMetrics()
    }

    // Función para manejar cuando el pane está listo
    const onPaneReady = () => {
        paneReadyTime.value = performance.now() - startTime.value
        console.log(`🎯  Panel listo en: ${paneReadyTime.value.toFixed(2)}ms`)
    }

    // Función para finalizar la carga
    const finishLoading = () => {
        loading.value = false
        initTime.value = performance.now() - startTime.value
        totalAppTime.value = initTime.value
        console.log(`🚀 Tiempo total de inicialización: ${initTime.value.toFixed(2)}ms`)
        console.log(`⏱️ Tiempo total de la aplicación: ${totalAppTime.value.toFixed(2)}ms`)
        
        updateMemoryMetrics()
        updateHardwareMetrics()
        console.log(`💾 Memoria usada: ${memoryUsage.value}`, memoryInfo.value)
        console.log(`🖥️ CPU Info:`, cpuInfo.value)
        console.log(`🎮 GPU Info:`, gpuInfo.value)
    }

    // Inicializar métricas
    onBeforeMount(() => {
        console.log('🕐 Iniciando medición de tiempo de inicialización...')
        startTime.value = performance.now()
    })

    onMounted(() => {
        const mountTime = performance.now() - startTime.value
        console.log(`⏱️ Tiempo de montaje del componente: ${mountTime.toFixed(2)}ms`)
        
        updateMemoryMetrics()
        updateHardwareMetrics()
        
        // Iniciar medición de FPS
        requestAnimationFrame(measureFramePerformance)
        
        // Simular un pequeño delay para mostrar el loading
        setTimeout(() => {
            finishLoading()
        }, 100)
        
        // Actualizar métricas cada segundo
        setInterval(() => {
            const currentMemoryInfo = getMemoryInfo()
            const currentMemory = getMemoryUsage()
            if (currentMemory !== 'N/A') {
                memoryInfo.value = currentMemoryInfo
                memoryUsage.value = currentMemory
            }
            
            // Actualizar métricas de CPU cada segundo
            const currentCPUInfo = getCPUInfo()
            cpuInfo.value = { ...cpuInfo.value, ...currentCPUInfo }
            
            // Actualizar métricas de hardware cada 5 segundos
            if (performance.now() % 5000 < 1000) {
                updateHardwareMetrics()
            }
        }, 1000)
    })

    return {
        // Estados
        startTime,
        initTime,
        loading,
        paneReadyTime,
        totalAppTime,
        memoryUsage,
        memoryInfo,
        cpuInfo,
        gpuInfo,
        performanceMetrics,
        cpuUsage,
        gpuUsage,
        frameTime,
        
        // Métodos
        getMemoryInfo,
        getMemoryUsage,
        getCPUInfo,
        getGPUInfo,
        getPerformanceMetrics,
        updateMemoryMetrics,
        updateHardwareMetrics,
        measureCPUUsage,
        measureGPUUsage,
        measureFramePerformance,
        onPaneReady,
        finishLoading
    }
}
