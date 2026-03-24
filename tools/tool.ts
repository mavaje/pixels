import {Point} from "../point";
import {Toolbox} from "../toolbox";

export abstract class Tool {

    element: HTMLDivElement;

    initialise() {
        let clicked = false;
        this.element.innerHTML = this.svg_icon(this.icon());
        // this.element.style.setProperty('--icon', this.svg_icon(this.icon()));
        this.element.addEventListener('pointerdown', () => clicked = true);
        document.addEventListener('pointerup', () => clicked = false);
        this.element.addEventListener('pointerup', event => {
            if (clicked) {
                Toolbox.set_active(this);
                event.preventDefault();
            }
        });
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
