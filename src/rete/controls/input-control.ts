import { ClassicPreset } from "rete";
import { InputControlType } from "../types";

// Control para customInputs
export default class InputControl extends ClassicPreset.Control {
    public value: string | number | boolean;
    public label: string;
    public type: InputControlType;

    constructor(type: InputControlType, label: string, value: string | number | boolean) {
      super();
      this.type = type;
      this.label = label;
      this.value = value;
    }
}