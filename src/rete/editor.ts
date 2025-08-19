import { AreaExtensions } from "rete-area-plugin";
import { createPlugins } from "./plugins-config";
import { ElementsBuilder } from "./elements-builder";
import { addCustomBackground } from "./custom-background";

export async function createEditor(container: HTMLElement) {
  // Crear plugins usando la configuración separada
  const { editor, area } = createPlugins(container);

  // Agregar fondo personalizado
  addCustomBackground(area);

  // Construcción de nodos
  const elementsBuilder = new ElementsBuilder(editor, area);
  await elementsBuilder.buildElements();

  // Hacer zoom para mostrar todos los nodos
  AreaExtensions.zoomAt(area, editor.getNodes());
}
