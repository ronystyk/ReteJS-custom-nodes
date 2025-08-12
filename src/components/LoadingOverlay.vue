<template>
    <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Inicializando aplicación...</p>
        <p v-if="initTime > 0">Tiempo de inicialización: {{ initTime }}ms</p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    loading: {
        type: Boolean,
        default: true
    },
    initTime: {
        type: Number,
        default: 0
    }
})
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    font-family: Arial, sans-serif;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #42b883;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-overlay p {
    margin: 5px 0;
    color: #333;
    font-size: 16px;
}
</style>
