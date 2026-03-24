
export class Favicon {

    static element = document.getElementById('favicon') as HTMLLinkElement;

    static icon(offset: number) {
        let o = 0;
        const dot = (x: number, y: number) =>
            `<rect x="${x}" y="${y}" width="1" height="1" fill="hsl(${360 * (o++ / 18 + offset)},100%,50%)"/>`;
        const svg = `
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-0.5 -0.5 8 8"
            >
                ${dot(1, 0)}
                ${dot(2, 0)}
                ${dot(3, 1)}
                ${dot(3, 2)}
                
                ${dot(3, 4)}
                ${dot(3, 5)}
                ${dot(4, 6)}
                ${dot(5, 6)}
                ${dot(6, 5)}
                ${dot(16, 4)}
                ${dot(5, 3)}
                ${dot(4, 3)}
                ${dot(3, 3)}
                ${dot(2, 3)}
                ${dot(1, 3)}
                ${dot(0, 2)}
                ${dot(0, 1)}
            </svg>
        `.replace(/\s+/g, ' ');
        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }

    static cycle() {
        const offset = (Date.now() / 10000) % 1;
        this.element.href = this.icon(offset);
        setTimeout(() => this.cycle(), 100);
    }
}
