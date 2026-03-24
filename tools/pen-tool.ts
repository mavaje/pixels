import {Point} from "../point";
import {Tool} from "./tool";
import {Block} from "../db/block";
import {Palette} from "../palette";

class PenTool extends Tool {

    name = 'pen';
    element = document.getElementById('pen-tool') as HTMLDivElement;

    on_drag(button: number, point: Point, prev_point: Point = point) {
        const index = Palette.button_map[button];
        const pip = Palette.pips[index] ?? Palette.pips[0];
        Block.draw_line(point, prev_point, pip.hex);
    }

    icon(): string {
        return `
            <polygon points="0,0 6,2 23,19 19,23 2,6"/>
            <line x1="2" y1="6" x2="6" y2="2"/>
            <line x1="16" y1="20" x2="20" y2="16"/>
        `;
    }

    preview_visible(): boolean {
        return true;
    }
}

export const pen_tool = new PenTool();
