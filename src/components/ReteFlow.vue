<template>
  <!-- Pane de Rete -->
  <div ref="reteContainer" class="rete-container"></div>
</template>

<script setup>
// Importar características de Vue
import { onMounted, ref } from 'vue'

// Importar la función de creación del editor
import { createEditor } from '../rete'

// Definir props para recibir onPaneReady
const props = defineProps({
  onPaneReady: {
    type: Function
  }
})

// Referencia al contenedor de Rete
const reteContainer = ref(null)

// Al montar el componente, crear el editor
onMounted(async () => {
  await createEditor(reteContainer.value)

  // Notificar al padre que el pane está listo
  props.onPaneReady()
})
</script>

<style>
.rete-container {
  width: 100vw;
  height: 100vh;
  background: #2c3e50;
}
</style>