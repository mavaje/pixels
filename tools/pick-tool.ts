import {Point} from "../point";
import {Tool} from "./tool";
import {Block} from "../db/block";
import {Palette} from "../palette";

class PickTool extends Tool {

    name = 'pick';
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
}

export const pick_tool = new PickTool();
