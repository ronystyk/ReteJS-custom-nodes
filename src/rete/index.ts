// Exportar la función principal del editor
export { createEditor } from "./editor";

// Exportar tipos para uso en otros archivos
export type { Schemes, AreaExtra } from "./types";

// Exportar clases para testing o uso avanzado
export { NodeFactory } from "./node-factory";
export { ElementsBuilder } from "./elements-builder";
export { createPlugins } from "./plugins-config";

// Exportar el control de entrada
export { default as InputControl } from "./controls/input-control";
