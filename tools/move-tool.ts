import {Point} from "../point";
import {Tool} from "./tool";
import {PixelGrid} from "../pixel-grid";

class MoveTool extends Tool {

    name = 'move';
    element = document.getElementById('move-tool') as HTMLDivElement;
    hotkey = ' ';

    on_drag(button: number, point: Point, prev_point?: Point) {
        if (prev_point) PixelGrid.move_by(prev_point.view().minus(point));
    }

    cursor(): string {
        return 'grab';
    }

    cursor_down(): string {
        return 'grabbing';
    }
}

export const move_tool = new MoveTool();
