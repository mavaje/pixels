import {pan_tool} from "./tools/pan-tool";
import {Tool} from "./tools/tool";
import {PixelGrid} from "./pixel-grid";
import {pick_tool} from "./tools/pick-tool";
import {pen_tool} from "./tools/pen-tool";

export class Toolbox {

    static tools = [
        pan_tool,
        pen_tool,
        pick_tool,
    ];

    static active: Tool;

    static pan_hotkey = false;

    static initialise() {
        this.tools.forEach(tool => {
            tool.initialise();
        })

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
}
