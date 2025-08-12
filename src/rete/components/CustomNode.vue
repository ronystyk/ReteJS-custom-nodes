<template>
    <div class="node" :class="{ selected: data.selected }" :style="nodeStyles()" data-testid="node">
        <div class="node-header" data-testid="title">
            <span class="node-icon">📋</span>
            <span class="node-title">{{ data.label }}</span>
        </div>
        <!-- Outputs-->
        <div class="output" v-for="[key, output] in outputs()" :key="key + seed" :data-testid="'output-' + key">
            <div class="output-title" data-testid="output-title">
                {{ output.label }}
            </div>
            <Ref class="output-socket" :emit="emit" :data="{
                type: 'socket',
                side: 'output',
                key: key,
                nodeId: data.id,
                payload: output.socket,
            }" data-testid="output-socket" />
        </div>
        <!-- Controls-->
        <Ref class="control" v-for="[key, control] in controls()" :key="key + seed" :emit="emit"
            :data="{ type: 'control', payload: control }" :data-testid="'control-' + key" />
        <!-- Inputs-->
        <div class="input" v-for="[key, input] in inputs()" :key="key + seed" :data-testid="'input-' + key">
            <Ref class="input-socket" :emit="emit" :data="{
                type: 'socket',
                side: 'input',
                key: key,
                nodeId: data.id,
                payload: input.socket,
            }" data-testid="input-socket" />
            <div class="input-title" v-show="!input.control || !input.showControl" data-testid="input-title">
                {{ input.label }}
            </div>
            <Ref class="input-control" v-show="input.control && input.showControl" :emit="emit"
                :data="{ type: 'control', payload: input.control }" data-testid="input-control" />
        </div>
    </div>
</template>

<script lang="js">
import { ref, defineComponent } from 'vue'
import { Ref } from 'rete-vue-plugin'

function sortByIndex(entries) {
    entries.sort((a, b) => {
        const ai = a[1] && a[1].index || 0
        const bi = b[1] && b[1].index || 0

        return ai - bi
    })
    return entries
}

export default defineComponent({
    props: ['data', 'emit', 'seed'],
    methods: {
        nodeStyles() {
            return {
                width: Number.isFinite(this.data.width) ? `${this.data.width}px` : '',
                height: Number.isFinite(this.data.height) ? `${this.data.height}px` : ''
            }
        },
        inputs() {
            return sortByIndex(Object.entries(this.data.inputs))
        },
        controls() {
            return sortByIndex(Object.entries(this.data.controls))
        },
        outputs() {
            return sortByIndex(Object.entries(this.data.outputs))
        }
    },
    components: {
        Ref
    }
})
</script>

<style scoped>
.node {
    background: white;
    border: 2px solid #42b883;
    border-radius: 8px;
    cursor: pointer;
    box-sizing: border-box;
    width: 200px;
    height: auto;
    position: relative;
    user-select: none;
    padding: 15px ;
}

.node.selected {
    border-color: #0f5837;
}

.node-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-weight: bold;
    color: #42b883;
}

.node-icon {
    font-size: 18px;
}

.node-title {
    font-size: 14px;
}

.node .output {
    text-align: right;
    position: absolute;
    right: -10px;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.node .input {
    text-align: right;
    position: absolute;
    left: -10px;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.node .output-socket {
    text-align: right;
    margin-right: -1px;
    display: inline-block;
}

.node .input-socket {
    text-align: left;
    margin-left: -1px;
    display: inline-block;
}

.node .input-title,
.node .output-title {
    vertical-align: middle;
    color: white;
    display: inline-block;
    font-family: sans-serif;
    font-size: 14px;
    margin: 6px;
    line-height: 24px;
}

.node .input-control {
    z-index: 1;
    width: calc(100% - 36px);
    vertical-align: middle;
    display: inline-block;
}

.node .control {
    margin-bottom: 10px;
}
</style>