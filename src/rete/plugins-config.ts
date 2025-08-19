// Importar Rete y plugins
import { NodeEditor } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin";
import { VuePlugin, Presets } from "rete-vue-plugin";

// Importar tipos
import { Schemes, AreaExtra } from "./types";

// Importar componentes personalizados
import CustomNode from "./components/CustomNode.vue";
import CustomConnection from "./components/CustomConection.vue";
import CustomSocket from "./components/CustomSocket.vue";
import CustomInput from "./components/CustomInput.vue";
import InputControl from "./controls/input-control";

export function createPlugins(container: HTMLElement) {
  // Crear editor de nodos
  const editor = new NodeEditor<Schemes>();

  // Crear plugin de área
  const area = new AreaPlugin<Schemes, AreaExtra>(container);

  // Crear plugin de conexiones
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();

  // Crear plugin de renderizado
  const render = new VuePlugin<Schemes, AreaExtra>();

  // Configurar extensiones del área
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  // Configurar renderizado con componentes personalizados
  render.addPreset(
    Presets.classic.setup({
      customize: {
        // Configurar nodos
        node: (_) => CustomNode,
        // Configurar sockets
        socket: (_) => CustomSocket,
        // Configurar conexiones
        connection: (_) => CustomConnection,
        // Configurar controles
        control: (data) => {
          if (data.payload instanceof InputControl) {
            return CustomInput;
          }
          return null;
        }
      }
    })
  );

  // Configurar conexiones
  connection.addPreset(ConnectionPresets.classic.setup());

  // Conectar plugin de área
  editor.use(area);
  
  // Conectar plugin de conexiones al plugin de área
  area.use(connection);

  // Conectar plugin de renderizado al plugin de área
  area.use(render);

  // Configurar orden de nodos 
  AreaExtensions.simpleNodesOrder(area);

  // Retornar plugins
  return { editor, area, connection, render };
}
