import { Pip } from "./pip";
import {Cookies} from "./cookies";
import {Colour} from "./colour";

export class Palette {

    static element = document.getElementById('palette');

    static pips: Pip[] = [];

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
    }

    static set_pip(button: number, hex: string, animate: boolean = false) {
        let pip = this.pips[button];

        if (pip) {
            pip.set_hex(hex, animate);
        } else {
            pip = new Pip(hex, button);
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
