// Importar plugin de área para manipular el área de trabajo
import { AreaExtensions } from "rete-area-plugin";

// Importar configuración de plugins
import { createPlugins } from "./plugins-config";

// Importar builder de elementos de prueba
import { ElementsBuilder } from "./elements-builder";

// Importar fondo personalizado
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
