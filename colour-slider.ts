import {Colour, ColourSpace, HSL, RGB} from "./colour";
import {Picker} from "./picker";
import {Slider} from "./slider";

export class ColourSlider<S extends ColourSpace = ColourSpace> extends Slider {

    constructor(
        id: string,
        name: string,
        public space: S,
        public key: {
            rgb: keyof RGB,
            hsl: keyof HSL,
        }[S],
    ) {
        super(id, name);
    }

    set_hex(hex: string, animate: boolean = true, move: boolean = true) {
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

    update_value(value: number, animate: boolean = true) {
        super.update_value(value, animate);

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

        this.knob.style.background = hex;

        Picker.sliders.forEach(slider => {
            if (this !== slider) {
                slider.set_hex(hex, animate, this.space !== slider.space);
            }
        });
    }

    tooltip(): string {
        switch (this.key) {
            case 'h':
                return `${this.name} = ${Math.round(this.value * 360)}°`;
            default:
                return super.tooltip();
        }
    }
}
