import { Pip } from "./pip";
import {Cookies} from "./cookies";
import {Colour} from "./colour";
import {Picker} from "./picker";

export class Palette {

    static element = document.getElementById('palette');

    static pips: Pip[] = [];

    static button_map = [0, 2, 1];

    static initialise() {
        const hexes = Cookies.load('palette');
        if (hexes) {
            hexes.split(',')
                .map(hex => Colour.clean_hex(hex, true))
                .slice(0, 3)
                .forEach((hex, i) => {
                    this.set_pip(i, hex);
                });
        }

        if (this.pips.length === 0) {
            this.set_pip(0, '#000000');
        }
    }

    static set_pip(index: number, hex: string, animate: boolean = false) {
        let pip = this.pips[index];

        if (pip) {
            pip.set_hex(hex, animate);
            if (pip === Picker.pip) {
                Picker.set_hex(hex);
                Picker.update_sliders();
            }
        } else {
            pip = new Pip(hex, this.button_map.indexOf(index));
            pip.initialise();
            this.pips.push(pip);
            this.element.append(pip.element);

            if (animate) {
                pip.element.classList.add('slide-in-out');
                setTimeout(() => pip.element.classList.remove('slide-in-out'));
            }
        }

        this.save_cookie();

        return pip;
    }

    static save_cookie() {
        Cookies.save('palette', this.pips.map(p => p.hex));
    }
}
