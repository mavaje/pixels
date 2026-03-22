import {ToolBox} from "./tool-box";
import {Picker} from "./picker";
import {Block} from "./db/block";
import {Point} from "./point";
import {Tool} from "./tool";

export class Pip extends Tool {

    element: HTMLDivElement;

    constructor(public hex: string) {
        super();

        this.element = document.createElement('div');
        this.element.classList.add('pip');
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
                const index = ToolBox.pips.indexOf(this);
                ToolBox.pips.forEach((pip, i) => {
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
                    pip.element.classList.add('animated');
                    pip.element.style.setProperty('--x', `${x}px`);
                });
            }
        });
        document.addEventListener('pointerup', event => {
            if (dragged) {
                const offset = this.drag_offset(event);
                const index = ToolBox.pips.indexOf(this);
                if (offset !== 0) {
                    const next_index = offset < 0
                        ? index + offset
                        : index + offset + 1
                    ToolBox.toolbox.insertBefore(this.element, ToolBox.pips[next_index]?.element);

                    ToolBox.pips.splice(index, 1);
                    ToolBox.pips.splice(index + offset, 0, this);

                    ToolBox.save_palette_cookie();
                }
            }
            clicked = false;
            dragged = false;
            this.element.style.removeProperty('--x');
            this.element.classList.remove('animated', 'dragging');
        });
        this.element.addEventListener('pointerup', event => {
            if (clicked) {
                if (!dragged && [0, 1, 2].includes(event.button)) {
                    const open_editor = Picker.pip
                        ? Picker.pip !== this
                        : ToolBox.active[event.button] === this;
                    Picker.set_editing(open_editor ? this : null);
                    ToolBox.set_active(this, event.button);
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
        const index = ToolBox.pips.indexOf(this);
        return Math.min(Math.max(offset, -index), 9 - index);
    }

    set_hex(hex: string, animate = true) {
        this.hex = hex;
        this.element.classList.toggle('animate', animate);
        this.element.style.setProperty('--hex', hex);
    }

    editing(editing: boolean): void {
        this.element.classList.toggle('editing', editing);
    }

    on_drag(p1: Point, p2: Point = p1): void {
        Block.draw_line(p1, p2, this.hex);
    }

    cookie_key(): string {
        return ToolBox.pips.indexOf(this).toString();
    }
}
