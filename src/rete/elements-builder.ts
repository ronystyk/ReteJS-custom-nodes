import { ClassicPreset } from "rete";
import { NodeEditor } from "rete";
import { AreaPlugin } from "rete-area-plugin";
import { Schemes, AreaExtra } from "./types";
import { NodeFactory } from "./node-factory";

export class ElementsBuilder {
  private nodeFactory: NodeFactory;
  private editor: NodeEditor<Schemes>;
  private area: AreaPlugin<Schemes, AreaExtra>;

  constructor(editor: NodeEditor<Schemes>, area: AreaPlugin<Schemes, AreaExtra>) {
    this.editor = editor;
    this.area = area;
    this.nodeFactory = new NodeFactory(editor);
  }

  async buildElements(cols = 10, rowsByElement = 10) {
    const inicio = await this.nodeFactory.createNode("Inicio");
    const salida = await this.nodeFactory.createNode("Salida");

    // Posicionar nodos de inicio y salida
    await this.area.translate(inicio.id, { x: 0, y: 400 });
    await this.area.translate(salida.id, { 
      x: 200 + ((cols + 1) * 400),
      y: 100 + (rowsByElement + 1) * 400 
    });

    // Crear y conectar nodos de formulario
    for (let y = 1; y <= cols; y++) {
      for (let x = 1; x <= rowsByElement; x++) {
        const form = await this.nodeFactory.createNode("Form");
        
        // Conectar inicio -> form
        await this.editor.addConnection(
          new ClassicPreset.Connection(inicio, "input", form, "output")
        );

        // Conectar form -> salida
        await this.editor.addConnection(
          new ClassicPreset.Connection(form, "input", salida, "output")
        );

        // Posicionar nodo de formulario
        await this.area.translate(form.id, { 
          x: 100 + x * 400, 
          y: 100 + y * 400 
        });
      }
    }
  }
}
