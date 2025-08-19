<template>
    <div class="input-group">
        <label>{{ data.label }}</label>
        <a-input type="text" :value="data.value" />
    </div>
</template>

<script>
import { Input } from "ant-design-vue";

export default {
  props: ['data'],
  components: {
    AInput: Input
  }
}
</script>

<style scoped>
.input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.input-group label {
    font-size: 12px;
    font-weight: 500;
    color: #666;
}

.input-group input,
.input-group select {
    padding: 6px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 12px;
    background: #f9f9f9;
}
</style>