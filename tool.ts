import {Point} from "./point";

export abstract class Tool {

    element: HTMLDivElement;

    activate(button: number = null) {
        this.element.classList.add('active');
        if (button !== null) {
            this.element.classList.add(`button-${button}`);
        }
    }

    deactivate() {
        this.element.classList.remove(
            'active',
            'button-0',
            'button-1',
            'button-2',
        );
    }

    cursor(): string {
        return 'auto';
    }

    abstract initialise(): void;
    abstract on_drag(p1: Point, p2?: Point): void;
    abstract cookie_key(): string;
}
