import {Picker} from "./picker";
import {Palette} from "./palette";
import {Icon} from "./icon";
import {Tooltip} from "./tooltip";

export class Pip extends Icon {

    element: HTMLDivElement = document.createElement('div');

    constructor(
        public hex: string,
        public button: number,
    ) {
        super();
    }

    initialise() {
        super.initialise();
        this.element.classList.add('pip', 'animate');
        this.set_button(this.button);
        this.set_hex(this.hex);

        Tooltip.show_on(this.element, () => this.tooltip());
    }

    on_click() {
        Picker.set_editing(Picker.pip === this ? null : this);
    }

    on_move(index: number, prev_index: number) {
        Palette.pips.splice(prev_index, 1);
        Palette.pips.splice(index, 0, this);
        Palette.update_buttons();
        Palette.save_cookie();
    }

    set_button(button: number) {
        this.button = button;
        this.element.classList.remove('button-0', 'button-1', 'button-2');
        this.element.classList.add(`button-${button}`);
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

    tooltip() {
        const hex = this.hex.toUpperCase();
        const button = [
            'LMB',
            'MMB',
            'RMB',
        ][this.button];
        return `[${button}] ${hex}`;
    }
}
