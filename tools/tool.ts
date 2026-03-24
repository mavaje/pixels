import {Point} from "../point";
import {Toolbox} from "../toolbox";
import {Icon} from "../icon";

export abstract class Tool extends Icon {

    name: string;
    element: HTMLDivElement;

    initialise() {
        super.initialise();
        const svg = this.element.getElementsByTagName('svg')[0];
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '-0.5 -0.5 24 24');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('fill', 'black');
        svg.setAttribute('stroke', 'white');
        svg.setAttribute('stroke-width', '1');
        svg.setAttribute('stroke-linejoin', 'round');
    }

    on_click() {
        Toolbox.set_active(this);
    }

    on_move(index: number, prev_index: number) {
        Toolbox.tools.splice(prev_index, 1);
        Toolbox.tools.splice(index, 0, this);
        Toolbox.save_cookie();
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

    cursor(): string {
        const svg = encodeURIComponent(this.element.innerHTML);
        return `url('data:image/svg+xml,${svg}'), crosshair`;
    }

    cursor_down(): string {
        return 'var(--cursor)';
    }

    preview_visible(): boolean {
        return false;
    }

    abstract on_drag(button: number, point: Point, prev_point?: Point): void;
}
