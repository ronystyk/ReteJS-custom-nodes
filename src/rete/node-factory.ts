// Importar ClassicPreset y NodeEditor de rete
import { ClassicPreset, NodeEditor } from "rete";

// Importar tipos
import { InputControlType, Schemes } from "./types";

// Importar control de entrada
import InputControl from "./controls/input-control";

// Factory para la creación de nodos
export class NodeFactory {
  private socket: ClassicPreset.Socket;
  private editor: NodeEditor<Schemes>;

  constructor(editor: NodeEditor<Schemes>) {
    this.socket = new ClassicPreset.Socket("socket");
    this.editor = editor;
  }

  // Crear nodo
  async createNode(title: string) {
    // Crear nodo
    const node = new ClassicPreset.Node(title);

    // Agregar entrada y salida
    node.addOutput("input", new ClassicPreset.Output(this.socket));
    node.addInput("output", new ClassicPreset.Input(this.socket));

    // Agregar controles solo si no es un nodo de inicio o salida
    if (title !== "Inicio" && title !== "Salida") {
      this.addFormControls(node);
    }

    // Agregar nodo al editor
    await this.editor.addNode(node);

    return node;
  }

  // Agregar controles al nodo
  private addFormControls(node: ClassicPreset.Node) {
    const controls = [
      { key: "ic1", label: "Nombre" ,  value: Math.random().toString(36).substring(2, 15) },
      { key: "ic2", label: "Apellido", value: Math.random().toString(36).substring(2, 15) },
      { key: "ic3", label: "Edad", value: Math.floor(Math.random() * 100) },
      { key: "ic4", label: "Email", value: `${Math.random().toString(36).substring(2, 15)}@gmail.com` }
    ];

    controls.forEach(({ key, label, value }) => {
      const inputControl = new InputControl(InputControlType.INPUT, label, value);
      node.addControl(key, inputControl);
    });
  }
}
