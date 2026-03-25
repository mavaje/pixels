import {Colour, ColourSpace, HSL, RGB} from "./colour";
import {Picker} from "./picker";
import {Tooltip} from "./tooltip";

export class Slider<S extends ColourSpace = ColourSpace> {

    element: HTMLElement;
    knob: HTMLElement;
    value: number;

    constructor(
        id: string,
        public space: S,
        public key: {
            rgb: keyof RGB,
            hsl: keyof HSL,
        }[S],
    ) {
        this.element = document.getElementById(id);

        this.knob = document.createElement('div');
        this.knob.classList.add('knob');
        this.element.append(this.knob);

        let dragging  = false;
        this.element.addEventListener('pointerdown', event => {
            dragging = true;
            this.on_slide(event);
        });
        document.addEventListener('pointermove', event => {
            if (dragging) this.on_slide(event, false);
        });
        document.addEventListener('pointerup', () => {
            if (dragging) {
                Tooltip.hide();
                dragging = false;
            }
        });
        document.addEventListener('pointercancel', () => dragging = false);

        Tooltip.show_on(this.element, () => this.tooltip(), -4);
    }

    set_value(hex: string, animate: boolean = true, move: boolean = true) {
        let stops: string[];
        switch (this.space) {
            case 'rgb':
                this.value = Picker.rgb[this.key as keyof RGB];
                const min_rgb = {...Picker.rgb, [this.key]: 0};
                const max_rgb = {...Picker.rgb, [this.key]: 1};
                stops = [
                    Colour.rgb_to_hex(min_rgb),
                    Colour.rgb_to_hex(max_rgb),
                ];
                break;
            case 'hsl':
                this.value = Picker.hsl[this.key as keyof HSL];
                stops = ({
                    h: [0, 1, 2, 3, 4, 5, 6].map(v => v / 6),
                    s: [0, 1],
                    l: [0, 0.5, 1],
                }[this.key as string])
                    .map(v => ({...Picker.hsl, [this.key]: v}))
                    .map(Colour.hsl_to_hex);
                break;
        }

        this.element.classList.toggle('animate', animate);
        this.element.style.setProperty('--stops', stops.join(','));
        this.knob.style.background = hex;
        if (move) this.knob.style.setProperty('--value', String(this.value));
    }

    on_slide(event: PointerEvent, animate: boolean = true) {
        this.value = (event.x
            - this.element.getBoundingClientRect().x
            - 18) / 240;
        this.value = Math.min(Math.max(this.value, 0), 1);

        let hex: string;
        switch (this.space) {
            case 'rgb':
                const rgb = {...Picker.rgb, [this.key]: this.value};
                hex = Colour.rgb_to_hex(rgb);
                Picker.set_hex(hex, animate);
                Picker.rgb = rgb;
                break;
            case 'hsl':
                const hsl = {...Picker.hsl, [this.key]: this.value};
                hex = Colour.hsl_to_hex(hsl);
                Picker.set_hex(hex, animate);
                Picker.hsl = hsl;
                break;
        }

        Picker.element.classList.add('animate');

        this.element.classList.toggle('animate', animate);
        this.knob.style.background = hex;
        this.knob.style.setProperty('--value', String(this.value));

        Picker.sliders.forEach(slider => {
            if (this !== slider) {
                slider.set_value(hex, animate, this.space !== slider.space);
            }
        });

        Tooltip.show(this.element, this.tooltip(), -4);
    }

    tooltip() {
        const name = {
            'r': 'Red',
            'g': 'Green',
            'b': 'Blue',
            'h': 'Hue',
            's': 'Saturation',
            'l': 'Lightness',
        }[this.key];

        const value = Math.round(this.value * (this.key === 'h' ? 360 : 100));

        const unit = this.key === 'h' ? '°' : '%';

        return `${name} = ${value}${unit}`;
    }
}
