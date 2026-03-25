
export class Tooltip {

    static element = document.getElementById('tooltip');

    static show_on(target: HTMLElement, content: string | (() => string), space?: number) {
        target.addEventListener('pointermove', () => {
            this.show(target, typeof content === 'function'
                ? content()
                : content, space);
        });
        target.addEventListener('pointerleave', () => this.hide());
    }

    static show(target: HTMLElement, content: string, space: number = 4) {
        const {x, y, width} = target.getBoundingClientRect();
        this.element.innerHTML = content;

        const tt = this.element.getBoundingClientRect();
        const left = Math.min(
            x + (width - tt.width) / 2,
            window.innerWidth - tt.width - 4,
        );
        const top = y - tt.height - space;
        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;
        this.element.classList.remove('hidden');
    }

    static hide() {
        this.element.classList.add('hidden');
    }
}
