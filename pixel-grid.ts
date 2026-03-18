import {Block} from "./db/block";
import {Point} from "./point";

export class PixelGrid {

    public static centre: Point = Point.grid(0, 0);
    public static scale: number = 4;

    private static width: number = 0;
    private static height: number = 0;

    private static canvas: HTMLCanvasElement = document.getElementById('pixel-grid') as HTMLCanvasElement;
    private static context: CanvasRenderingContext2D;

    static resize() {
        const {width, height} = document.body.getBoundingClientRect();
        this.width = PixelGrid.canvas.width = width;
        this.height = PixelGrid.canvas.height = height;
        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;

        this.initialise_blocks();
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

    static initialise_blocks(): void {
        const [left, top] = Point.grid(this.left(), this.top()).block_xy();
        for (let x = left; x < this.right(); x += Block.SIZE) {
            for (let y = top; y < this.bottom(); y += Block.SIZE) {
                const block_point = Point.grid(x, y);
                if (!(block_point.block_id() in Block.blocks)) {
                    new Block(block_point);
                }
            }
        }
    }

    static clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    static render() {
        Object.values(Block.blocks).forEach(block => block.render());
    }

    static render_block(block: Block): void {
        const x = Math.floor((block.point.x - this.left()) * this.scale);
        const y = Math.floor((block.point.y - this.top()) * this.scale);
        const size = Block.SIZE * this.scale;
        this.context.drawImage(block.canvas, x, y, size, size);
    }

    static move_to(centre: Point) {
        this.centre = centre.grid();
        this.clear();
        this.initialise_blocks();
        this.render();
        this.update_hash();
    }

    static move_by(delta: Point) {
        this.move_to(this.centre.plus(delta));
    }

    private static timeout: NodeJS.Timeout = null;
    static update_hash() {
        const hash = this.centre.hash_id();
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
