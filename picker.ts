import {Pip} from "./pip";
import {Slider} from "./slider";
import {Colour, HSL, RGB} from "./colour";
import {ToolBox} from "./tool-box";

export class Picker {

    static element = document.getElementById('picker');

    static pip: Pip = null;
    static sliders: Slider[] = [];
    static hex_input = document.getElementById('hex-input') as HTMLInputElement;

    static rgb: RGB;
    static hsl: HSL;

    static initialise() {
        this.sliders.push(new Slider('slider-r', 'rgb', 'r'));
        this.sliders.push(new Slider('slider-g', 'rgb', 'g'));
        this.sliders.push(new Slider('slider-b', 'rgb', 'b'));
        this.sliders.push(new Slider('slider-h', 'hsl', 'h'));
        this.sliders.push(new Slider('slider-s', 'hsl', 's'));
        this.sliders.push(new Slider('slider-l', 'hsl', 'l'));

        this.hex_input.addEventListener('change', () => {
            const hex = Colour.clean_hex(this.hex_input.value, true);
            this.set_hex(hex);
            this.sliders.forEach(slider => slider.set_value(hex));
        });
    }

    static set_editing(pip: Pip) {
        this.element.classList.toggle('animate', !!this.pip);

        this.pip?.editing(false);
        this.pip = pip;
        this.pip?.editing(true);

        this.element.classList.toggle('hidden', !pip);

        if (pip) {
            this.rgb = Colour.hex_to_rgb(pip.hex);
            this.hsl = Colour.hex_to_hsl(pip.hex);
            this.sliders.forEach(slider => slider.set_value(pip.hex));
            this.hex_input.value = pip.hex;
        }
    }

    static set_hex(hex: string, animate: boolean = true) {
        Picker.pip.set_hex(hex, animate);
        this.rgb = Colour.hex_to_rgb(hex);
        this.hsl = Colour.hex_to_hsl(hex);
        ToolBox.save_palette_cookie();
        this.hex_input.value = hex;
    }
}
