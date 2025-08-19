import { BaseSchemes } from "rete";
import { AreaPlugin } from "rete-area-plugin";
import "../styles/background.css";

// Función para agregar un fondo personalizado al área
export function addCustomBackground<S extends BaseSchemes, K>(
  area: AreaPlugin<S, K>
) {
  const background = document.createElement("div");

  background.classList.add("background");
  background.classList.add("fill-area");

  area.area.content.add(background);
}
