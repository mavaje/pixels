import {Point} from "../point";
import {Tool} from "./tool";
import {Block} from "../db/block";
import {Palette} from "../palette";

class PickTool extends Tool {
    element = document.getElementById('pick-tool') as HTMLDivElement;

    on_drag(button: number, point: Point, prev_point?: Point) {
        if (button !== null) {
            const hex = Block.pixel_at(point);
            const index = Palette.button_map[button];
            Palette.set_pip(index, hex, true);
        }
    }

    preview_visible(): boolean {
        return true;
    }

    icon(): string {
        return `
            <polygon points="0,0 3,0 18,15 15,18 0,3"/>
            <path d="M16,8 L18,10 C14,14 23,14 23,18  23,21 21,23 18,23  14,23 14,14 10,18 L8,16 Z"/>
        `;
    }
}

export const pick_tool = new PickTool();
