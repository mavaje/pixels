import {Tooltip} from "./tooltip";

export class Slider {

    element: HTMLElement;
    knob: HTMLElement;
    value: number;
    vertical: boolean;

    constructor(
        id: string,
        public name: string,
    ) {
        this.element = document.getElementById(id);

        this.vertical = this.element.classList.contains('vertical');

        this.knob = document.createElement('div');
        this.knob.classList.add('knob');
        this.element.append(this.knob);

        let dragging  = false;
        this.element.addEventListener('pointerdown', event => {
            dragging = true;
            this.element.classList.add('sliding');
            this.on_slide(event);
        });
        document.addEventListener('pointermove', event => {
            if (dragging) this.on_slide(event, false);
        });
        document.addEventListener('pointerup', () => {
            if (dragging) {
                Tooltip.hide();
                dragging = false;
                this.element.classList.remove('sliding');
            }
        });
        document.addEventListener('pointercancel', () => {
            dragging = false;
            this.element.classList.remove('sliding');
        });

        Tooltip.show_on(this.element, () => this.tooltip(), -4);
    }

    basis(): number {
        const {x, y} = this.element.getBoundingClientRect();
        return this.vertical ? y : x;
    }

    on_slide(event: PointerEvent, animate: boolean = true) {
        this.update_value(
            ((this.vertical ? event.y : event.x)
                - this.basis()
                - 18) / 240,
            animate,
        );

        this.show_tooltip();
    }

    update_value(value: number, animate: boolean = true) {
        this.value = Math.min(Math.max(value, 0), 1);

        this.element.classList.toggle('animate', animate);
        this.knob.style.setProperty('--value', String(this.value));
    }

    show_tooltip() {
        Tooltip.show(this.element, this.tooltip(), -4);
    }

    tooltip(): string {
        return `${this.name} = ${Math.round(this.value * 100)}%`;
    }
}
