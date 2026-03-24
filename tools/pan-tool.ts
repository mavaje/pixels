import {Point} from "../point";
import {Tool} from "./tool";
import {PixelGrid} from "../pixel-grid";

class PanTool extends Tool {

    name = 'pan';
    element = document.getElementById('pan-tool') as HTMLDivElement;

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

export const pan_tool = new PanTool();
