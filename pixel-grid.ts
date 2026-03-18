import {Block} from "./db/block";
import {Point} from "./point";
import {DEBUG} from "./config";

export class PixelGrid {

    public static centre: Point = Point.grid(0, 0);
    public static scale: number = 4;

    private static width: number = 0;
    private static height: number = 0;

    private static grid_canvas: HTMLCanvasElement = document.getElementById('pixel-grid') as HTMLCanvasElement;
    private static grid_context: CanvasRenderingContext2D;

    private static block_point: Point;
    private static block_canvas: OffscreenCanvas;
    private static block_context: OffscreenCanvasRenderingContext2D;

    private static debug_layer = document.getElementById('debug-layer');

    static resize() {
        const {width, height} = document.body.getBoundingClientRect();
        this.width = PixelGrid.grid_canvas.width = width;
        this.height = PixelGrid.grid_canvas.height = height;
        this.grid_context = this.grid_canvas.getContext('2d');
        this.grid_context.imageSmoothingEnabled = false;

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

    static sync_blocks(): void {
        this.block_point = Point.grid(this.left(), this.top()).block();
        const [left, top] = this.block_point.xy();
        let x: number, y: number;
        for (x = left; x < this.right(); x += Block.SIZE) {
            for (y = top; y < this.bottom(); y += Block.SIZE) {
                const block_point = Point.grid(x, y);
                if (!(block_point.block_id() in Block.blocks)) {
                    new Block(block_point);
                }
            }
        }
        this.block_canvas = new OffscreenCanvas(x - left, y - top);
        this.block_context = this.block_canvas.getContext('2d');
    }

    static clear() {
        this.block_context?.clearRect(0, 0, this.block_canvas.width, this.block_canvas.height);
        this.grid_context.clearRect(0, 0, this.width, this.height);
    }

    static render() {
        this.update_hash();
        this.sync_blocks();
        this.clear();
        Object.values(Block.blocks).forEach(block => {
            block.render();
        });
    }

    static render_block(block: Block): void {
        const x = Math.floor((block.point.x - this.left()) * this.scale);
        const y = Math.floor((block.point.y - this.top()) * this.scale);
        const size = Block.SIZE * this.scale;

        this.block_context.drawImage(
            block.canvas,
            block.point.x - this.block_point.x,
            block.point.y - this.block_point.y,
        );

        this.grid_context.drawImage(
            this.block_canvas,
            Math.floor((this.block_point.x - this.left()) * this.scale),
            Math.floor((this.block_point.y - this.top()) * this.scale),
            this.block_canvas.width * this.scale,
            this.block_canvas.height * this.scale,
        );

        if (DEBUG && block.debug_element) {
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
        if (origin) {
            this.centre = this.centre
                .minus(origin)
                .scale(this.scale / scale)
                .plus(origin);
        }
        this.scale = scale;
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
