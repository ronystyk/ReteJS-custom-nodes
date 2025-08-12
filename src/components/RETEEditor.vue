<template>
    <div ref="reteContainer" class="rete-container"></div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { createEditor } from '../rete/editor'
  
  // Definir props para recibir onPaneReady
  const props = defineProps({
    onPaneReady: {
      type: Function,
      default: () => {}
    }
  })
  
  const reteContainer = ref(null)
  
  onMounted(async () => {
    const editor = await createEditor(reteContainer.value)
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
  