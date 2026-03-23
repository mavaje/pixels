import {Point} from "./point";
import {ToolBox} from "./tool-box";

export abstract class Tool {

    element: HTMLDivElement;
    badge_container: HTMLDivElement;

    activate(button: number = null) {
        this.element.classList.add('active');
        if (ToolBox.active.length > 1) {
            const badge = document.createElement('div');
            badge.innerText = ['L', 'M', 'R'][button];
            badge.classList.add('badge', `button-${button}`);
            this.badge_container.append(badge);
        }
    }

    deactivate() {
        this.element.classList.remove('active');
        this.badge_container.innerHTML = '';
    }

    cursor(): string {
        return 'auto';
    }

    cursor_down(): string {
        return 'var(--cursor)';
    }

    abstract initialise(): void;
    abstract on_drag(p1: Point, p2?: Point): void;
    abstract cookie_key(): string;
}
