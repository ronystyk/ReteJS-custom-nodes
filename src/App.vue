<template>
    <div style="width: 100vw; height: 100vh">
        <LoadingOverlay :loading="loading" :initTime="initTime" />

        <MetricsPanel 
            :initTime="initTime"
            :paneReadyTime="paneReadyTime"
            :totalAppTime="totalAppTime"
            :memoryUsage="memoryUsage"
            :memoryInfo="memoryInfo"
            :cpuInfo="cpuInfo"
            :performanceMetrics="performanceMetrics"
            :cpuUsage="cpuUsage"
            :frameTime="frameTime"
        />

        <ReteFlow :onPaneReady="onPaneReady" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingOverlay from './components/LoadingOverlay.vue'
import MetricsPanel from './components/MetricsPanel.vue'
import { usePerformanceMetrics } from './composables/usePerformanceMetrics'
import ReteFlow from './components/ReteFlow.vue'
// import { createEditor } from './rete/editor'

// const rete = ref(null)

// Usar el composable de métricas de rendimiento
const {
    initTime,
    loading,
    paneReadyTime,
    totalAppTime,
    memoryUsage,
    memoryInfo,
    cpuInfo,
    performanceMetrics,
    cpuUsage,
    frameTime,
    onPaneReady
} = usePerformanceMetrics()

</script>

<style>
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
}

.rete {
    width: 100vw;
    height: 100vh;
}
</style>
