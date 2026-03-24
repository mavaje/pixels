import {Picker} from "./picker";
import {Palette} from "./palette";

export class Pip {

    element: HTMLDivElement;

    constructor(
        public hex: string,
        public button: number,
    ) {
        this.element = document.createElement('div');
        this.element.classList.add('pip', `button-${button}`, 'animate');

        this.set_hex(hex);
    }

    initialise() {
        let clicked = false;
        let dragged = false;
        this.element.addEventListener('pointerdown', () => clicked = true);
        document.addEventListener('pointermove', event => {
            if (clicked) {
                const {width} = this.element.getBoundingClientRect();
                const offset = this.drag_offset(event);
                if (offset !== 0) {
                    dragged = true;
                    this.element.classList.add('dragging');
                }
                const index = Palette.pips.indexOf(this);
                Palette.pips.forEach((pip, i) => {
                    let x: number;
                    if (i === index) {
                        x = offset * width;
                    } else if ((index + offset) <= i && i < index) {
                        x = width;
                    } else if (index < i && i <= (index + offset)) {
                        x = -width;
                    } else {
                        x = 0;
                    }
                    pip.element.classList.add('animate');
                    pip.element.style.setProperty('--x', `${x}px`);
                });
            }
        });
        document.addEventListener('pointerup', event => {
            if (dragged) {
                const offset = this.drag_offset(event);
                const index = Palette.pips.indexOf(this);
                if (offset !== 0) {
                    const next_index = offset < 0
                        ? index + offset
                        : index + offset + 1;
                    Palette.element.insertBefore(this.element, Palette.pips[next_index]?.element);

                    Palette.pips.splice(index, 1);
                    Palette.pips.splice(index + offset, 0, this);

                    Palette.save_cookie();
                }
            }
            clicked = false;
            dragged = false;
            this.element.style.removeProperty('--x');
            this.element.classList.remove('animate', 'dragging');
        });
        this.element.addEventListener('pointerup', event => {
            if (clicked) {
                if (!dragged) {
                    Picker.set_editing(Picker.pip === this ? null : this);
                }
                event.preventDefault();
            }
        }, {passive: false});
        this.element.addEventListener('contextmenu', event => event.preventDefault(), {passive: false});
    }

    drag_offset(event: PointerEvent): number {
        const {x, width} = this.element.getBoundingClientRect();
        const pip_x = x + width / 2;
        let offset = Math.round((event.x - pip_x) / width);
        const index = Palette.pips.indexOf(this);
        return Math.min(Math.max(offset, -index), Palette.pips.length - 1 - index);
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
