import {Pip} from "./pip";
import {Colour} from "./colour";

export class Palette {

    static element = document.getElementById('palette');

    static pips: Pip[] = [];

    static active: Pip[] = [];

    static initialise() {
        this.load_cookies();
        if (this.pips.length === 0) this.load_default_palette();
        if (this.active.length === 0) this.set_active(this.pips[0], 0);
    }

    static load_default_palette() {
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
    }

    static load_cookies(): boolean {
        for (const cookie of document.cookie.split(/;\s*/g)) {
            const [key, value] = cookie.split('=');
            switch (key) {
                case 'palette':
                    const hexes = value
                        .split(',')
                        .map(h => Colour.clean_hex(h, true));

                    for (let i = 0; i < 10; i++) {
                        this.add_colour_pip(hexes[i] ?? '#000000');
                    }

                    break;

                case 'buttons':
                    const indices = value
                        .split(',')
                        .map(b => Number.parseInt(b));

                    indices.forEach((index, button) => {
                        if (!isNaN(index)) {
                            this.set_active(this.pips[index], button);
                        }
                    });
            }
        }
        return false;
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
        this.save_button_cookie();
    }

    static update_pips() {
        this.pips.forEach(pip => pip.deactivate());
        const show_button = new Set(Palette.active.filter(Boolean)).size > 1;
        Palette.active.forEach((pip, i) => {
            pip?.activate(show_button ? i : null);
        });
    }

    static save_palette_cookie() {
        document.cookie = `palette=${this.pips.map(p => p.hex).join(',')}`;
    }

    static save_button_cookie() {
        document.cookie = `buttons=${this.active.map(p => this.pips.indexOf(p)).join(',')}`;
    }
}
