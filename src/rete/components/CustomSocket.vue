<template>
  <div class="socket" :title="data.name"></div>
</template>

<script>
export default {
  props: ['data']
}
</script>

<style scoped>
.socket {
  display: inline-block;
  cursor: pointer;
  border: 0px;
  width: 20px;
  border-radius: 10px;
  height: 20px;
  vertical-align: middle;
  background: #fff;
  box-shadow: 0 0 3px 1px #666;
  z-index: 2;
  box-sizing: border-box;
}

.socket:hover {
  background: #ddd;
}
</style>