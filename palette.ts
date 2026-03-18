
export class Palette {

    static element = document.getElementById('palette');

    static colour_pips = [];

    static current_colour = '#000000';

    static initialise() {
        this.add_colour_pip('#000000');
        this.add_colour_pip('#ff0000');
        this.add_colour_pip('#ffff00');
        this.add_colour_pip('#00ff00');
        this.add_colour_pip('#00ffff');
        this.add_colour_pip('#0000ff');
        this.add_colour_pip('#ff00ff');
        this.add_colour_pip('#ffffff');
    }

    static add_colour_pip(hex: string) {
        const pip = document.createElement('div');
        pip.classList.add('pip');
        pip.style.background = hex;
        pip.addEventListener('click', () => {
            this.current_colour = hex;
        });
        this.element.append(pip);
    }
}
