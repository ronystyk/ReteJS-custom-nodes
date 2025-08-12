<template>
  <svg data-testid="connection">
    <path :d="path"></path>
  </svg>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['data', 'start', 'end', 'path']
})
</script>

<style scoped>
svg {
  overflow: visible !important;
  position: absolute;
  pointer-events: none;
  width: 9999px;
  height: 9999px;
}

svg path {
  fill: none;
  stroke-width: 3px;
  stroke-dasharray: 5;              /* Tamaño de los guiones */
  stroke-dashoffset: 0;
  pointer-events: auto;
  stroke: #999;
  /* animation: dashmove 1s linear infinite; */
}

@keyframes dashmove {
  to {
    stroke-dashoffset: -20;          /* Se mueve hacia la izquierda */
  }
}
</style>