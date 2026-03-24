
export abstract class Icon {
    element: HTMLDivElement;

    private x: number;
    private width: number;

    initialise() {
        let clicked = false;
        let dragged = false;
        this.element.addEventListener('pointerdown', () => {
            clicked = true;
            const {x, width} = this.element.getBoundingClientRect();
            this.x = x;
            this.width = width;
        });
        document.addEventListener('pointermove', event => {
            if (clicked) {
                const offset = this.drag_offset(event);
                if (offset !== 0) {
                    dragged = true;
                    this.element.classList.add('dragging');
                }
                const index = this.index();
                this.siblings().forEach((child, i) => {
                    let x: number;
                    if (i === index) {
                        x = offset * this.width;
                    } else if ((index + offset) <= i && i < index) {
                        x = this.width;
                    } else if (index < i && i <= (index + offset)) {
                        x = -this.width;
                    } else {
                        x = 0;
                    }
                    child.classList.add('animate');
                    child.style.setProperty('--x', `${x}px`);
                });
            }
        });
        document.addEventListener('pointerup', event => {
            if (dragged) {
                const offset = this.drag_offset(event);
                if (offset !== 0) {
                    const index = this.index();
                    const next_index = offset < 0
                        ? index + offset
                        : index + offset + 1;
                    this.siblings().forEach(child => child.classList.remove('animate'));
                    this.parent().insertBefore(this.element, this.siblings()[next_index]);
                    this.on_move(index + offset, index);
                }
            }
            clicked = false;
            dragged = false;
            this.element.style.removeProperty('--x');
            this.element.classList.remove('animate', 'dragging');
        });
        this.element.addEventListener('pointerup', event => {
            if (clicked) {
                if (!dragged) this.on_click();
                event.preventDefault();
            }
        }, {passive: false});
        this.element.addEventListener('contextmenu', event => event.preventDefault());
    }

    parent() {
        return this.element.parentElement;
    }

    siblings() {
        return [...this.parent().children] as HTMLElement[];
    }

    index() {
        return this.siblings().indexOf(this.element);
    }

    drag_offset(event: PointerEvent): number {
        const pip_x = this.x + this.width / 2;
        let offset = Math.round((event.x - pip_x) / this.width);
        return Math.min(Math.max(offset, -this.index()), this.siblings().length - 1 - this.index());
    }

    abstract on_click(): void;
    abstract on_move(index: number, prev_index: number): void;
}
