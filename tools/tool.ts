import {Point} from "../point";
import {Toolbox} from "../toolbox";
import {Icon} from "../icon";

export abstract class Tool extends Icon {

    element: HTMLDivElement;

    initialise() {
        super.initialise();
        this.element.innerHTML = this.svg_icon(this.icon());
    }

    on_click() {
        Toolbox.set_active(this);
    }

    on_move(index: number, prev_index: number) {
    }

    set active(active: boolean) {
        this.element.classList.toggle('active', active);
    }

    protected svg_icon(path: string): string {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <g fill="black" stroke="white" stroke-width="1" stroke-linejoin="round" transform="translate(0.5,0.5)">
                ${path}
            </g>
        </svg>`.replace(/\s+/g, ' ');
    }

    protected svg_cursor(path: string, fallback: string = 'crosshair') {
        return `url('data:image/svg+xml,${encodeURIComponent(this.svg_icon(path))}'), ${fallback}`;
    }

    cursor(): string {
        return this.svg_cursor(this.icon());
    }

    cursor_down(): string {
        return 'var(--cursor)';
    }

    preview_visible(): boolean {
        return false;
    }

    abstract icon(): string;
    abstract on_drag(button: number, point: Point, prev_point?: Point): void;
}
