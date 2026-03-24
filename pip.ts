import {Picker} from "./picker";
import {Palette} from "./palette";
import {Icon} from "./icon";

export class Pip extends Icon {

    element: HTMLDivElement;

    constructor(
        public hex: string,
        public button: number,
    ) {
        super();

        this.element = document.createElement('div');
        this.element.classList.add('pip', `button-${button}`, 'animate');

        this.set_hex(hex);
    }

    on_click() {
        Picker.set_editing(Picker.pip === this ? null : this);
    }

    on_move(index: number, prev_index: number) {
        Palette.pips.splice(prev_index, 1);
        Palette.pips.splice(index, 0, this);
        Palette.save_cookie();
    }

    set_hex(hex: string, animate = true) {
        if (hex !== this.hex) {
            this.element.classList.toggle('animate', animate);
        }
        this.hex = hex;
        this.element.style.setProperty('--hex', hex);
    }

    editing(editing: boolean): void {
        this.element.classList.toggle('editing', editing);
    }
}
