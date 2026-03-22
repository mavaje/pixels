import {Pip} from "./pip";
import {Colour} from "./colour";
import {pan_tool} from "./pan-tool";
import {Tool} from "./tool";
import {PixelGrid} from "./pixel-grid";

export class ToolBox {

    static toolbox = document.getElementById('toolbox');

    static add_pip_button = document.getElementById('add-pip');

    static pips: Pip[] = [];

    static active: Tool[] = [];

    static initialise() {
        this.load_cookies();
        if (this.pips.length === 0) this.load_default_palette();
        if (this.active.length === 0) this.set_active(this.pips[0], 0);

        pan_tool.initialise();

        this.add_pip_button.addEventListener('click', () => {
            this.add_colour_pip('#000000');
        });
    }

    static load_default_palette() {
        this.add_colour_pip('#000000');
        this.add_colour_pip('#ffffff');
    }

    static load_cookies(): boolean {
        for (const cookie of document.cookie.split(/;\s*/g)) {
            const [key, value] = cookie.split('=');
            switch (key) {
                case 'palette':
                    value
                        .split(',')
                        .map(hex => Colour.clean_hex(hex, true))
                        .forEach(hex => {
                            this.add_colour_pip(hex);
                        });
                    break;

                case 'buttons':
                    value.split(',').forEach((tool, button) => {
                        if (tool === 'pan') {
                            this.set_active(pan_tool, button);
                        } else {
                            const pip_index = Number.parseInt(tool);
                            if (!isNaN(pip_index)) {
                                this.set_active(this.pips[pip_index], button);
                            }
                        }
                    });
            }
        }
        return false;
    }

    static add_colour_pip(hex: string) {
        const pip = new Pip(hex);
        pip.initialise();
        this.pips.push(pip);
        this.toolbox.insertBefore(pip.element, this.add_pip_button);
    }

    static set_active(tool: Tool, button: number) {
        ToolBox.active[button] = tool;
        this.update_tools();
        this.save_button_cookie();
    }

    static get_active(button: number): Tool {
        return this.active[button] ?? pan_tool;
    }

    static update_tools() {
        pan_tool.deactivate();
        this.pips.forEach(pip => pip.deactivate());
        const show_button = new Set(ToolBox.active.filter(Boolean)).size > 1;
        ToolBox.active.forEach((pip, i) => {
            pip?.activate(show_button ? i : null);
        });
        PixelGrid.canvas.style.cursor = ToolBox.active[0]?.cursor() ?? 'auto';
    }

    static save_palette_cookie() {
        document.cookie = `palette=${this.pips.map(p => p.hex).join(',')}`;
    }

    static save_button_cookie() {
        document.cookie = `buttons=${this.active.map(p => p.cookie_key()).join(',')}`;
    }
}
