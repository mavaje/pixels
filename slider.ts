import {Colour, ColourSpace, HSL, RGB} from "./colour";
import {Picker} from "./picker";

export class Slider<S extends ColourSpace = ColourSpace> {

    element: HTMLElement;
    knob: HTMLElement;

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
        document.addEventListener('pointerup', () => dragging = false);
        document.addEventListener('pointercancel', () => dragging = false);
    }

    set_value(hex: string, animate: boolean = true, move: boolean = true) {
        let value: number;
        let stops: string[];
        switch (this.space) {
            case 'rgb':
                const rgb = Colour.hex_to_rgb(hex);
                value = rgb[this.key as keyof RGB];
                const min_rgb = {...rgb, [this.key]: 0};
                const max_rgb = {...rgb, [this.key]: 1};
                stops = [
                    Colour.rgb_to_hex(min_rgb),
                    Colour.rgb_to_hex(max_rgb),
                ];
                break;
            case 'hsl':
                const hsl = Colour.hex_to_hsl(hex);
                value = hsl[this.key as keyof HSL];
                stops = ({
                    h: [0, 1, 2, 3, 4, 5, 6].map(v => v / 6),
                    s: [0, 1],
                    l: [0, 0.5, 1],
                }[this.key as string])
                    .map(v => ({...hsl, [this.key]: v}))
                    .map(Colour.hsl_to_hex);
                break;
        }

        this.element.classList.toggle('animate', animate);
        this.element.style.setProperty('--stops', stops.join(','));
        this.knob.style.background = hex;
        if (move) this.knob.style.setProperty('--value', String(value));
    }

    on_slide(event: PointerEvent, animate: boolean = true) {
        let value = (event.x
            - this.element.getBoundingClientRect().x
            - 18) / 324;
        value = Math.min(Math.max(value, 0), 1);

        let hex: string;
        switch (this.space) {
            case 'rgb':
                const rgb = {...Picker.rgb, [this.key]: value};
                hex = Colour.rgb_to_hex(rgb);
                Picker.set_hex(hex, animate);
                Picker.rgb = rgb;
                break;
            case 'hsl':
                const hsl = {...Picker.hsl, [this.key]: value};
                hex = Colour.hsl_to_hex(hsl);
                Picker.set_hex(hex, animate);
                Picker.hsl = hsl;
                break;
        }

        Picker.element.classList.add('animate');

        this.element.classList.toggle('animate', animate);
        this.knob.style.background = hex;
        this.knob.style.setProperty('--value', String(value));

        Picker.sliders.forEach(slider => {
            if (this !== slider) {
                slider.set_value(hex, animate, this.space !== slider.space);
            }
        });
    }
}
