import {Point} from "../point";
import {Tool} from "./tool";
import {PixelGrid} from "../pixel-grid";

class PanTool extends Tool {

    name = 'pan';
    element = document.getElementById('pan-tool') as HTMLDivElement;

    on_drag(button: number, point: Point, prev_point?: Point) {
        if (prev_point) PixelGrid.move_by(prev_point.view().minus(point));
    }

    icon(): string {
        return `
            <polygon points="11.5,0 16.5,5 13,5 13,10 18,10 18,6.5 23,11.5 18,16.5 18,13 13,13 13,18 16.5,18 11.5,23 6.5,18 10,18 10,13 5,13 5,16.5 0,11.5 5,6.5 5,10 10,10 10,5 6.5,5"/>
        `;
    }

    cursor(): string {
        return 'grab';
    }

    cursor_down(): string {
        return 'grabbing';
    }
}

export const pan_tool = new PanTool();
