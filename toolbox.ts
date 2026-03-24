import {pan_tool} from "./tools/pan-tool";
import {Tool} from "./tools/tool";
import {PixelGrid} from "./pixel-grid";
import {pick_tool} from "./tools/pick-tool";
import {pen_tool} from "./tools/pen-tool";
import {Cookies} from "./cookies";

export class Toolbox {

    static element = document.getElementById('tools') as HTMLElement;

    static tools: Tool[] = [
        pan_tool,
        pen_tool,
        pick_tool,
    ];

    static active: Tool;

    static pan_hotkey = false;

    static initialise() {
        const cookie = Cookies.load('tools');
        if (cookie) {
            const tools: Tool[] = [];
            cookie.split(',')
                .forEach(name => {
                    const tool = this.tools.find(t => t.name === name);
                    if (tool && !tools.includes(tool)) tools.push(tool);
                });
            this.tools.forEach(tool => {
                if (!tools.includes(tool)) tools.push(tool);
            });
            this.tools = tools;
            this.element.innerText = '';
            this.element.append(...this.tools.map(t => t.element));
        }

        this.tools.forEach(tool => {
            tool.initialise();
        });

        this.set_active(pan_tool);
    }

    static set_active(tool: Tool) {
        this.active = tool;
        this.tools.forEach(t => t.active = t === tool);
        this.update_cursor();
    }

    static active_tool(event: MouseEvent|KeyboardEvent): Tool {
        if (this.pan_hotkey) {
            return pan_tool;
        } else if (event.altKey) {
            return pick_tool;
        } else {
            return this.active;
        }
    }

    static update_cursor(tool: Tool = this.active) {
        PixelGrid.canvas.style.setProperty('--cursor', tool.cursor());
        PixelGrid.canvas.style.setProperty('--cursor-down', tool.cursor_down());
    }

    static save_cookie() {
        Cookies.save('tools', this.tools.map(p => p.name));
    }
}
