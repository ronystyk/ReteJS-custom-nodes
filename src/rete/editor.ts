import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets
} from "rete-connection-plugin";
import { VuePlugin, Presets, VueArea2D } from "rete-vue-plugin";
import CustomNode from "./components/CustomNode.vue";
import CustomConnection from "./components/CustomConection.vue";
import CustomSocket from "./components/CustomSocket.vue";
import CustomInput from "././components/CustomInput.vue"
import { addCustomBackground } from "./custom-background.ts";

class Node extends ClassicPreset.Node<
  Record<string, ClassicPreset.Socket>,
  Record<string, ClassicPreset.Socket>,
  Record<
    string,
    | InputControl
    | ClassicPreset.InputControl<"number">
    | ClassicPreset.InputControl<"text">
  >
> {}

class InputControl extends ClassicPreset.Control {
  constructor(public value: string) {
    super();
  }
}

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = VueArea2D<Schemes>;

export async function createEditor(container: HTMLElement) {
  const socket = new ClassicPreset.Socket("socket");

  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new VuePlugin<Schemes, AreaExtra>();

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  render.addPreset(
    Presets.classic.setup({
      customize: {
        node: (_) => CustomNode,
        socket: (_) => CustomSocket,
        connection: (_) => CustomConnection,
        control: (_) => CustomInput,
      }
    })
  );

  connection.addPreset(ConnectionPresets.classic.setup());

  addCustomBackground(area);

  editor.use(area);
  area.use(connection);
  area.use(render);

  AreaExtensions.simpleNodesOrder(area);

  const makeForm = (title: string) => {
    const node = new ClassicPreset.Node(title);
    node.addOutput("input", new ClassicPreset.Output(socket));
    node.addInput("output", new ClassicPreset.Input(socket));

    if (title !== "Inicio" && title !== "Salida") {
      const inputControl1 = new InputControl("Nombre");
      const inputControl2 = new InputControl("Apellido");
      const inputControl3 = new InputControl("Edad");
      const inputControl4 = new InputControl("Email");
      node.addControl("ic1", inputControl1);
      node.addControl("ic2", inputControl2);
      node.addControl("ic3", inputControl3);
      node.addControl("ic4", inputControl4);
    }

    editor.addNode(node);

    return node;
  }

  

  const buildElements = async (cols = 10, rowsByElement = 10) => {
    const inicio = makeForm("Inicio");
    const salida = makeForm("Salida");
    for (let y = 1; y <= cols; y++) {
      for (let x = 1; x <= rowsByElement; x++) {
        const form = makeForm("Form");
        await editor.addConnection(new ClassicPreset.Connection(inicio, "input", form, "output"));
        await area.translate(inicio.id, { x: 100, y: 400 });

        await editor.addConnection(new ClassicPreset.Connection(form, "input", salida, "output"));
        await area.translate(salida.id, { x: 200 + ((cols + 1) * 400), y: 100 +(rowsByElement + 1) * 400 });

        await area.translate(form.id, { x: 100 + x * 400, y: 100 + y * 400 });
      }
    }
  }
  await buildElements();

  AreaExtensions.zoomAt(area, editor.getNodes());

  return () => area.destroy();
}
