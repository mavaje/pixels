import {Block} from "./db/block";
import {Point} from "./point";
import {DEBUG} from "./config";

export class PixelGrid {

    public static centre: Point = Point.grid(0, 0);
    public static scale: number = 4;

    private static width: number = 0;
    private static height: number = 0;

    private static canvas: HTMLCanvasElement = document.getElementById('pixel-grid') as HTMLCanvasElement;
    private static context: CanvasRenderingContext2D;

    private static debug_layer = document.getElementById('debug-layer');

    static resize() {
        const {width, height} = document.body.getBoundingClientRect();
        this.width = width;
        this.height = height;

        this.sync_canvas();
        this.sync_blocks();
        this.render();
    }

    static left(): number {
        return this.centre.x - this.width / (2 * this.scale);
    }

    static right(): number {
        return this.centre.x + this.width / (2 * this.scale);
    }

    static top(): number {
        return this.centre.y - this.height / (2 * this.scale);
    }

    static bottom(): number {
        return this.centre.y + this.height / (2 * this.scale);
    }

    static sync_canvas() {
        const left = Math.floor(this.left());
        const right = Math.ceil(this.right());
        const top = Math.floor(this.top());
        const bottom = Math.ceil(this.bottom());

        this.canvas.width = right - left;
        this.canvas.height = bottom - top;

        this.canvas.style.marginLeft = `${(left - this.left()) * this.scale}px`;
        this.canvas.style.marginRight = `${(this.right() - right) * this.scale}px`;
        this.canvas.style.marginTop = `${(top - this.top()) * this.scale}px`;
        this.canvas.style.marginBottom = `${(this.bottom() - bottom) * this.scale}px`;

        this.context = this.canvas.getContext('2d');
    }

    static sync_blocks(): void {
        const [left, top] = Point.grid(this.left(), this.top()).block().xy();
        let x: number, y: number;
        for (x = left; x < this.right(); x += Block.SIZE) {
            for (y = top; y < this.bottom(); y += Block.SIZE) {
                const block_point = Point.grid(x, y);
                if (!(block_point.block_id() in Block.blocks)) {
                    new Block(block_point);
                }
            }
        }
    }

    static clear() {
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height,
        );
    }

    static render() {
        this.update_hash();
        this.sync_canvas();
        this.sync_blocks();
        this.clear();
        Object.values(Block.blocks).forEach(block => {
            block.render();
        });
    }

    static render_block(block: Block): void {
        this.context.drawImage(
            block.canvas,
            block.point.x - Math.floor(this.left()),
            block.point.y - Math.floor(this.top()),
        );

        if (DEBUG && block.debug_element) {
            const x = Math.floor((block.point.x - this.left()) * this.scale);
            const y = Math.floor((block.point.y - this.top()) * this.scale);
            const size = Block.SIZE * this.scale;

            block.debug_element.style.left = `${x + 1}px`;
            block.debug_element.style.top = `${y + 1}px`;
            block.debug_element.style.width = `${size - 2}px`;
            block.debug_element.style.height = `${size - 2}px`;

            if (!block.debug_element.isConnected) {
                this.debug_layer.append(block.debug_element);
            }
        }
    }

    static move_to(centre: Point) {
        this.centre = centre.grid();
        this.render();
    }

    static move_by(delta: Point) {
        this.centre = this.centre.plus(delta);
        this.render();
    }

    static set_scale(scale: number, origin?: Point) {
        scale = Math.max(scale, 1);
        // scale = Math.min(scale, 1);

        if (origin) {
            this.centre = this.centre
                .minus(origin)
                .scale(this.scale / scale)
                .plus(origin);
        }
        this.scale = scale;
        this.sync_canvas();
        this.render();
    }

    static scale_by(delta: number, origin?: Point) {
        this.set_scale(this.scale * 1.01 ** -delta, origin);
    }

    private static timeout: NodeJS.Timeout = null;
    static update_hash() {
        const hash = this.centre.hash_id(this.scale);
        if (hash !== location.hash) {
            if (this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                if (history.pushState) {
                    history.pushState(null, null, hash);
                } else {
                    location.hash = hash;
                }
            }, 10);
        }
    }
}
