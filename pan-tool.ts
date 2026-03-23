import {Point} from "./point";
import {Tool} from "./tool";
import {ToolBox} from "./tool-box";
import {PixelGrid} from "./pixel-grid";

class PanTool extends Tool {
    element = document.getElementById('pan-tool') as HTMLDivElement;
    badge_container = document.getElementById('pan-badges') as HTMLDivElement;

    initialise() {
        this.element.classList.add('animate');
        this.badge_container.classList.add('badge');

        let clicked = false;
        this.element.addEventListener('pointerdown', () => clicked = true);
        document.addEventListener('pointerup', () => clicked = false);
        this.element.addEventListener('pointerup', event => {
            if (clicked) {
                if ([0, 1, 2].includes(event.button)) {
                    ToolBox.set_active(this, event.button);
                }
                event.preventDefault();
            }
        });
        this.element.addEventListener('contextmenu', event => event.preventDefault(), {passive: false});
    }

    on_drag(p1: Point, p2?: Point) {
        if (p2) PixelGrid.move_by(p2.view().minus(p1));
    }

    cookie_key(): string {
        return 'pan';
    }

    cursor(): string {
        return 'grab';
    }

    cursor_down(): string {
        return 'grabbing';
    }
}

export const pan_tool = new PanTool();
