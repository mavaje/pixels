import {ToolBox} from "./tool-box";
import {Picker} from "./picker";
import {Block} from "./db/block";
import {Point} from "./point";
import {Tool} from "./tool";

export class Pip extends Tool {

    constructor(public hex: string) {
        super();

        this.element = document.createElement('div');
        this.element.classList.add('pip');

        this.badge_container = document.createElement('div');
        this.badge_container.classList.add('badges');
        this.element.append(this.badge_container);

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

    cursor(): string {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const context = canvas.getContext('2d');

        context.translate(0.5, 0.5);

        const width = 3;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(1 + width, 1);
        context.lineTo(1, 1 + width);
        // context.bezierCurveTo(6, 4, 4, 6, 2, 6);
        context.closePath();

        context.moveTo(1 + width, 1);
        context.lineTo(15, 15 - width);
        // context.bezierCurveTo(23, 21, 21, 23, 19, 23);
        context.lineTo(15 - width, 15);
        context.lineTo(1, 1 + width);
        // context.bezierCurveTo(4, 6, 6, 4, 6, 2);
        context.lineTo(1 + width, 1);
        context.closePath();

        context.fillStyle = 'black';
        context.fill();

        context.strokeStyle = 'white';
        context.lineWidth = 1;
        context.stroke();

        context.fillStyle = this.hex;
        context.fillRect(0, 8, 7, 7);
        context.strokeRect(0, 8, 7, 7);

        return `url(${canvas.toDataURL()}), auto`;
    }
}
