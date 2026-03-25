import {move_tool} from "./tools/move-tool";
import {Tool} from "./tools/tool";
import {PixelGrid} from "./pixel-grid";
import {pick_tool} from "./tools/pick-tool";
import {draw_tool} from "./tools/draw-tool";
import {Cookies} from "./cookies";
import {Point} from "./point";

export class Toolbox {

    static element = document.getElementById('tools') as HTMLElement;

    static tools: Tool[] = [
        move_tool,
        draw_tool,
        pick_tool,
    ];

    static active: Tool;
    static hot: Tool;

    static initialise() {
        const tools_cookie = Cookies.load('tools');
        if (tools_cookie) {
            const tools: Tool[] = [];
            tools_cookie.split(',')
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

        const tool_cookie = Cookies.load('tool');
        if (tool_cookie) {
            const tool = this.tools.find(t => t.name === tool_cookie);
            if (tool) this.set_active(tool);
        }

        if (!this.active) this.set_active(this.tools[0]);
    }

    static set_active(tool: Tool) {
        this.active = tool;
        this.tools.forEach(t => t.active = t === tool);
        this.update_cursor();
        this.save_cookie();
    }

    static set_hot(tool: Tool) {
        this.hot = tool;
        this.tools.forEach(t => t.hot = t === tool);
        this.update_cursor();
    }

    static active_tool(): Tool {
        return this.hot ?? this.active;
    }

    static update_cursor(cursor?: Point) {
        const tool = this.hot ?? this.active;
        PixelGrid.canvas.style.setProperty('--cursor', tool.cursor());
        PixelGrid.canvas.style.setProperty('--cursor-down', tool.cursor_down());
        PixelGrid.update_preview(tool.preview_visible(), cursor);
    }

    static save_cookie() {
        Cookies.save('tools', this.tools.map(p => p.name));
        Cookies.save('tool', this.active.name);
    }
}
