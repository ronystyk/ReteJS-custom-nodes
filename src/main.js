// Medir tiempo de inicialización de la aplicación
const appStartTime = performance.now()
console.log('🚀 Iniciando aplicación Vue Flow...')

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Medir tiempo de creación de la app
const appCreationTime = performance.now() - appStartTime
console.log(`📱 Tiempo de creación de la app: ${appCreationTime.toFixed(2)}ms`)

app.mount('#app')

// Medir tiempo total hasta el montaje
const totalInitTime = performance.now() - appStartTime
console.log(`⚡ Tiempo total de inicialización de la aplicación: ${totalInitTime.toFixed(2)}ms`)

// Exponer métricas globalmente para debugging
window.appMetrics = {
    appStartTime,
    appCreationTime,
    totalInitTime,
    getCurrentTime: () => performance.now() - appStartTime
}
