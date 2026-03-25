
export type ColourSpace = 'rgb' | 'hsl';

export type RGB = {r: number, g: number, b: number};
export type HSL = {h: number, s: number, l: number};

export class Colour {

    static clean_hex(hex: string, hash: boolean = false) {
        if (hash) return '#' + this.clean_hex(hex, false);
        hex = hex.replace(/[^\da-f]/gi, '');
        switch (hex.length) {
            case 0:
                return '000000';
            case 1:
                return hex.repeat(6);
            case 2:
                return hex.repeat(3);
            case 3:
                const [r, g, b] = hex;
                return r + r + g + g + b + b;
            default:
                return hex.padEnd(6, '0').slice(0, 6);
        }
    }

    static hex_to_rgb(hex: string): RGB {
        hex = this.clean_hex(hex);
        const [r, g, b] = [0, 2, 4]
            .map(i => hex.slice(i, i + 2))
            .map(x => (Number.parseInt(x, 16) || 0) / 255);
        return {r, g, b};
    }

    static rgb_to_hex({r, g, b}: RGB, bytes: boolean = false): string {
        return '#' + [r, g, b]
            .map(v => Math.max(0, Math.min(Math.floor(v * (bytes ? 1 : 256)), 255)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    static rgb_to_hsl({r, g, b}: RGB): HSL {
        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
        const range = max - min;
        const l = (min + max) / 2;
        const scale = 1 - Math.abs(2 * l - 1);
        const s = scale > 0 ? range / scale : 0;
        const h = range > 0 ? {
            [r]: (g - b) / (6 * range) + 1,
            [g]: (b - r) / (6 * range) + 1 / 3,
            [b]: (r - g) / (6 * range) + 2 / 3,
        }[max] % 1 : 0;
        return {h, s, l};
    }

    static hsl_to_rgb({h, s, l}: HSL): RGB {
        const c = s * (1 - Math.abs(2 * l - 1));
        const x = c * (1 - Math.abs((6 * h) % 2 - 1));
        const min = l - c / 2;
        const mid = min + x;
        const max = min + c;
        return [
            {r: max, g: mid, b: min},
            {r: mid, g: max, b: min},
            {r: min, g: max, b: mid},
            {r: min, g: mid, b: max},
            {r: mid, g: min, b: max},
            {r: max, g: min, b: mid},
        ][Math.floor((h % 1) * 6)];
    }

    static hex_to_hsl(hex: string): HSL {
        return Colour.rgb_to_hsl(Colour.hex_to_rgb(hex));
    }

    static hsl_to_hex(hsl: HSL): string {
        return Colour.rgb_to_hex(Colour.hsl_to_rgb(hsl));
    }
}
