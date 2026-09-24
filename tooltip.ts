
export class Tooltip {

    static element = document.getElementById('tooltip');
    static timeout = null;

    static show_on(target: HTMLElement, content: string | (() => string), space?: number) {
        target.addEventListener('pointermove', () => {
            clearTimeout(this.timeout);
            this.show(target, typeof content === 'function'
                ? content()
                : content, space);
        });
        target.addEventListener('pointerleave', () => this.hide());
    }

    static show(target: HTMLElement, content: string, space: number = 4, hide_after = 1.5) {
        const {x, y, width, height} = target.getBoundingClientRect();
        this.element.innerHTML = content;

        const tt = this.element.getBoundingClientRect();

        let left = Math.min(
            x + (width - tt.width) / 2,
            window.innerWidth - tt.width - 4,
        );
        let top = y - tt.height - space;

        if (left < window.innerWidth / 4) {
            left = x + width + space;
            top = Math.min(
                y + (height - tt.height) / 2,
                window.innerHeight - tt.height - 4,
            );
        }

        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;
        this.element.classList.remove('hidden');

        clearTimeout(this.timeout);
        if (hide_after) {
            this.timeout = setTimeout(() => this.hide(), hide_after * 1000);
        }
    }

    static hide() {
        this.element.classList.add('hidden');
    }
}
