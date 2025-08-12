<template>
    <div class="metrics-panel">
        <h3>📊 Métricas de Rendimiento</h3>
        
        <!-- Métricas de tiempo -->
        <div class="section">
            <h4>⏱️ Tiempos</h4>
            <div class="metric">
                <span>Inicialización:</span>
                <span class="value">{{ initTime.toFixed(2) }}ms</span>
            </div>
            <div class="metric">
                <span>Flow listo:</span>
                <span class="value">{{ paneReadyTime.toFixed(2) }}ms</span>
            </div>
            <div class="metric">
                <span>Tiempo total:</span>
                <span class="value">{{ totalAppTime }}ms</span>
            </div>
            <div v-if="performanceMetrics.frameTime" class="metric">
                <span>Frame time:</span>
                <span class="value">{{ performanceMetrics.frameTime }}ms</span>
            </div>
        </div>

        <!-- Métricas de memoria -->
        <div class="section">
            <h4>💾 Memoria</h4>
            <div class="metric">
                <span>Usada:</span>
                <span class="value">{{ memoryUsage }}{{ memoryInfo.used ? 'MB' : '' }}</span>
            </div>
            <div v-if="memoryInfo.total" class="metric">
                <span>Total:</span>
                <span class="value">{{ memoryInfo.total }}MB</span>
            </div>
            <div v-if="memoryInfo.limit" class="metric">
                <span>Límite:</span>
                <span class="value">{{ memoryInfo.limit }}MB</span>
            </div>
        </div>

        <!-- Métricas de CPU -->
        <div class="section">
            <h4>🖥️ CPU</h4>
            <div v-if="cpuInfo.cores" class="metric">
                <span>Núcleos:</span>
                <span class="value">{{ cpuInfo.cores }}</span>
            </div>
            <div v-if="cpuInfo.usage !== undefined" class="metric">
                <span>Uso actual:</span>
                <span class="value" :class="getUsageClass(cpuInfo.usage)">{{ cpuInfo.usage }}%</span>
            </div>
            <div v-if="cpuInfo.processingTime" class="metric">
                <span>Tiempo proc:</span>
                <span class="value">{{ cpuInfo.processingTime }}ms</span>
            </div>
            <div v-if="cpuInfo.platform" class="metric">
                <span>Plataforma:</span>
                <span class="value">{{ cpuInfo.platform }}</span>
            </div>
        </div>

        <!-- Métricas de GPU -->
        <div class="section">
            <h4>🎮 GPU</h4>
            <div v-if="gpuInfo.gpuUsage !== undefined" class="metric">
                <span>Uso actual:</span>
                <span class="value" :class="getUsageClass(gpuInfo.gpuUsage)">{{ gpuInfo.gpuUsage }}%</span>
            </div>
            <div v-if="gpuInfo.renderTime" class="metric">
                <span>Tiempo render:</span>
                <span class="value">{{ gpuInfo.renderTime }}ms</span>
            </div>
            <div v-if="gpuInfo.framesRendered" class="metric">
                <span>Frames render:</span>
                <span class="value">{{ gpuInfo.framesRendered }}</span>
            </div>
            <div v-if="gpuInfo.renderer" class="metric">
                <span>Renderizador:</span>
                <span class="value">{{ gpuInfo.renderer }}</span>
            </div>
            <div v-if="gpuInfo.vendor" class="metric">
                <span>Fabricante:</span>
                <span class="value">{{ gpuInfo.vendor }}</span>
            </div>
            <div v-if="gpuInfo.webglVersion" class="metric">
                <span>WebGL:</span>
                <span class="value">{{ gpuInfo.webglVersion }}</span>
            </div>
            <div v-if="gpuInfo.maxTextureSize" class="metric">
                <span>Max Textura:</span>
                <span class="value">{{ gpuInfo.maxTextureSize }}</span>
            </div>
        </div>

        <!-- Métricas de rendimiento -->
        <div class="section">
            <h4>📈 Rendimiento</h4>
            <div v-if="performanceMetrics.fps" class="metric">
                <span>FPS:</span>
                <span class="value" :class="getFPSClass(performanceMetrics.fps)">{{ performanceMetrics.fps }}</span>
            </div>
            <div v-if="performanceMetrics.viewportWidth" class="metric">
                <span>Viewport:</span>
                <span class="value">{{ performanceMetrics.viewportWidth }}x{{ performanceMetrics.viewportHeight }}</span>
            </div>
            <div v-if="performanceMetrics.screenWidth" class="metric">
                <span>Pantalla:</span>
                <span class="value">{{ performanceMetrics.screenWidth }}x{{ performanceMetrics.screenHeight }}</span>
            </div>
            <div v-if="performanceMetrics.domContentLoaded" class="metric">
                <span>DOM Ready:</span>
                <span class="value">{{ performanceMetrics.domContentLoaded.toFixed(2) }}ms</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    initTime: {
        type: Number,
        default: 0
    },
    paneReadyTime: {
        type: Number,
        default: 0
    },
    totalAppTime: {
        type: Number,
        default: 0
    },
    memoryUsage: {
        type: String,
        default: 'N/A'
    },
    memoryInfo: {
        type: Object,
        default: () => ({})
    },
    cpuInfo: {
        type: Object,
        default: () => ({})
    },
    gpuInfo: {
        type: Object,
        default: () => ({})
    },
    performanceMetrics: {
        type: Object,
        default: () => ({})
    },
    cpuUsage: {
        type: Number,
        default: 0
    },
    gpuUsage: {
        type: Number,
        default: 0
    },
    frameTime: {
        type: Number,
        default: 0
    }
})

// Función para obtener la clase CSS basada en el porcentaje de uso
const getUsageClass = (usage) => {
    if (usage >= 80) return 'high-usage'
    if (usage >= 50) return 'medium-usage'
    return 'low-usage'
}

// Función para obtener la clase CSS basada en FPS
const getFPSClass = (fps) => {
    if (fps >= 55) return 'good-fps'
    if (fps >= 30) return 'medium-fps'
    return 'low-fps'
}
</script>

<style scoped>
.metrics-panel {
    width: 250px;
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    font-family: 'Courier New', monospace;
    font-size: 11px;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    min-width: 250px;
    max-height: 80vh;
    overflow-y: auto;
}

.metrics-panel h3 {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #333;
    text-align: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
}

.section {
    margin: 10px 0;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
}

.section:last-child {
    border-bottom: none;
}

.section h4 {
    margin: 0 0 5px 0;
    font-size: 12px;
    color: #666;
    font-weight: bold;
}

.metric {
    display: flex;
    justify-content: space-between;
    margin: 3px 0;
    padding: 1px 0;
}

.metric .value {
    font-weight: bold;
    color: #42b883;
    text-align: right;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.metric span:first-child {
    color: #666;
    flex-shrink: 0;
}

/* Clases para diferentes niveles de uso */
.low-usage {
    color: #28a745 !important;
}

.medium-usage {
    color: #ffc107 !important;
}

.high-usage {
    color: #dc3545 !important;
}

/* Clases para diferentes niveles de FPS */
.good-fps {
    color: #28a745 !important;
}

.medium-fps {
    color: #ffc107 !important;
}

.low-fps {
    color: #dc3545 !important;
}
</style>
