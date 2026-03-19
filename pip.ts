import {Palette} from "./palette";
import {Picker} from "./picker";

export class Pip {

    element: HTMLDivElement;

    constructor(public hex: string) {
        this.element = document.createElement('div');
        this.element.classList.add('pip');
        this.set_hex(hex);

        let clicked = false;
        this.element.addEventListener('pointerdown', event => {
            clicked = true;
            event.preventDefault();
        }, {passive: false});
        this.element.addEventListener('pointerup', event => {
            if (clicked && [0, 1, 2].includes(event.button)) {
                Palette.set_active(this, event.button);
                Picker.set_editing(Picker.pip === this ? null : this);
                event.preventDefault();
            }
            clicked = false;
        }, {passive: false});
        this.element.addEventListener('contextmenu', event => event.preventDefault(), {passive: false});
    }

    set_hex(hex: string, animate = true) {
        this.hex = hex;
        this.element.classList.toggle('animate', animate);
        this.element.style.setProperty('--hex', hex);
    }

    deactivate() {
        this.element.classList.remove(
            'active',
            'button-0',
            'button-1',
            'button-2',
        );
    }

    activate(button: number = null) {
        this.element.classList.add('active');
        if (button !== null) this.element.classList.add(`button-${button}`);
    }

    editing(editing: boolean) {
        this.element.classList.toggle('editing', editing);
    }
}
