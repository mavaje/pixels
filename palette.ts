import {Pip} from "./pip";

export class Palette {

    static element = document.getElementById('palette');

    static pips: Pip[] = [];

    static active: Pip[] = [];

    static initialise() {
        this.add_colour_pip('#000000');
        this.add_colour_pip('#ffffff');
        this.add_colour_pip('#ff0000');
        this.add_colour_pip('#ff7f00');
        this.add_colour_pip('#ffff00');
        this.add_colour_pip('#00ff00');
        this.add_colour_pip('#00ffff');
        this.add_colour_pip('#007fff');
        this.add_colour_pip('#0000ff');
        this.add_colour_pip('#ff00ff');

        this.set_active(this.pips[0], 0);
    }

    static add_colour_pip(hex: string) {
        const pip = new Pip(hex);
        this.pips.push(pip);
        this.element.append(pip.element);
    }

    static get_hex(button: number) {
        return (this.active[button] ?? this.pips[0]).hex;
    }

    static set_active(pip: Pip, button: number) {
        Palette.active[button] = pip;
        this.update_pips();
    }

    static update_pips() {
        this.pips.forEach(pip => pip.deactivate());
        const show_button = new Set(Palette.active.filter(Boolean)).size > 1;
        Palette.active.forEach((pip, i) => {
            pip?.activate(show_button ? i : null);
        });
    }
}
