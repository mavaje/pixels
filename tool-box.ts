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
    static last_tool: Tool = pan_tool;

    static initialise() {
        pan_tool.initialise();

        this.load_cookies();
        if (this.pips.length === 0) this.load_default_palette();

        if (this.active.length === 0) this.set_active(this.pips[0], 0);

        this.update_last_tool(this.active[0]);

        // this.add_pip_button.addEventListener('click', () => {
        //     this.add_colour_pip('#000000', true);
        // });
    }

    static tools(): Tool[] {
        return [
            pan_tool,
            ...this.pips,
        ];
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
                            const pip = this.pips[Number.parseInt(tool)];
                            if (pip) this.set_active(pip, button);
                        }
                    });
            }
        }
        return false;
    }

    static add_colour_pip(hex: string, animate: boolean = false) {
        const pip = new Pip(hex);
        pip.initialise();
        this.pips.push(pip);
        this.toolbox.insertBefore(pip.element, this.add_pip_button);
    }

    static set_active(tool: Tool, button: number) {
        this.active[button] = tool;
        this.update_last_tool(tool);
        this.update_tools();
        this.save_button_cookie();
    }

    static get_active(button: number): Tool {
        return this.active[button] ?? pan_tool;
    }

    static update_tools() {
        this.tools().forEach(pip => pip.deactivate());
        this.active.forEach((pip, i) => {
            pip?.activate(i);
        });
        this.update_cursor();
    }

    static update_last_tool(tool: Tool) {
        this.last_tool = tool;
        this.update_cursor();
    }

    static update_cursor(tool: Tool = this.last_tool) {
        PixelGrid.canvas.style.setProperty('--cursor', tool.cursor());
        PixelGrid.canvas.style.setProperty('--cursor-down', tool.cursor_down());
    }

    static save_palette_cookie() {
        document.cookie = `palette=${this.pips.map(p => p.hex).join(',')}`;
    }

    static save_button_cookie() {
        document.cookie = `buttons=${this.active.map(p => p?.cookie_key() ?? '').join(',')}`;
    }
}
