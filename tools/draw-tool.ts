import {Point} from "../point";
import {Tool} from "./tool";
import {Block} from "../db/block";
import {Palette} from "../palette";

class DrawTool extends Tool {

    name = 'draw';
    element = document.getElementById('draw-tool') as HTMLDivElement;

    on_drag(button: number, point: Point, prev_point: Point = point) {
        const index = Palette.button_map[button];
        const pip = Palette.pips[index] ?? Palette.pips[0];
        Block.draw_line(point, prev_point, pip.hex);
    }

    preview_visible(): boolean {
        return true;
    }
}

export const draw_tool = new DrawTool();
