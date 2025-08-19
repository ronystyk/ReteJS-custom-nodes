import { GetSchemes, ClassicPreset } from "rete";
import { VueArea2D } from "rete-vue-plugin";

export type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;

export type AreaExtra = VueArea2D<Schemes>;

export enum InputControlType {
  INPUT = "text",
  NUMBER = "number",
  CHECKBOX = "checkbox",
  DATE = "date",
}
