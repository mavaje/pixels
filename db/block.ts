import {onValue, ref, Unsubscribe, update} from "@firebase/database";
import {db} from "./db";
import {PixelGrid} from "../pixel-grid";
import {Point} from "../point";
import {DEBUG} from "../config";

export class Block {

    public static readonly SIZE = 256;

    public static readonly PIXEL_ID_FORMAT = /^[0-9a-f]{4}$/;
    public static readonly PIXEL_VALUE_FORMAT = /^[0-9a-f]{3}$/;

    public static blocks: {
        [id: string]: Block;
    } = {};

    public canvas = new OffscreenCanvas(Block.SIZE, Block.SIZE);

    public debug_element: HTMLDivElement;

    unsubscribe: Unsubscribe;

    constructor(
        public point: Point,
    ) {
        // console.log(`init ${this.point.block_id()}`);

        const unsubscribe_db_listener = onValue(ref(db, `pixels/${this.point.block_id()}`), snapshot => {
            const pixels: Record<string, string> = snapshot.val();

            if (!pixels || !(typeof pixels === 'object')) return;

            Object.entries(pixels).forEach(([id, hex]) => {
                if (Block.PIXEL_ID_FORMAT.test(id) && Block.PIXEL_VALUE_FORMAT.test(hex)) {
                    const x = Number.parseInt(id.slice(0, 2), 16);
                    const y = Number.parseInt(id.slice(2, 4), 16);
                    this.set_pixel([x, y], hex);
                }
            });

            this.render();
        });

        Block.blocks[this.point.block_id()] = this;

        this.unsubscribe = () => {
            unsubscribe_db_listener();
            delete Block.blocks[this.point.block_id()];
            this.debug_element?.remove();
        }

        if (DEBUG) {
            this.debug_element = document.createElement('div')
            this.debug_element.id = `block:${this.point.block_id()}`;
            this.debug_element.classList.add('block');

            const label = document.createElement('div');
            label.classList.add('label');
            label.innerText = this.point.block_id();
            this.debug_element.append(label);
        }
    }

    static async draw_line(
        p1: Point,
        p2: Point,
        hex: string,
    ): Promise<void> {
        const blocks: Record<string, Record<string, string>> = {};

        p1 = p1.grid().floor();
        p2 = p2.grid().floor();

        const delta = p2.minus(p1);

        const dx = Math.abs(delta.x);
        const dy = Math.abs(delta.y);
        const sx = Math.sign(delta.x);
        const sy = Math.sign(delta.y);

        let p = p1;
        let error = dx - dy;

        while (true) {
            const block_id = p.block_id();
            const pixel_id = p.pixel_id();

            blocks[block_id] ??= {};
            blocks[block_id][pixel_id] = hex;

            const [px, py] = p.pixel().xy();
            Block.blocks[block_id]?.set_pixel([px, py], hex);

            if (p.equals(p2)) break;
            const e2 = error * 2;
            if (e2 > -dy) {
                error -= dy;
                p = p.plus(sx, 0);
            }
            if (e2 < dx) {
                error += dx;
                p = p.plus(0, sy);
            }
        }

        for (const [block_id, pixels] of Object.entries(blocks)) {
            Block.blocks[block_id]?.render();
            await update(ref(db, `pixels/${block_id}`), pixels);
        }
    }

    set_pixel(
        [x, y]: [number, number],
        hex: string,
    ) {
        const context = this.canvas.getContext('2d');
        context.fillStyle = `#${hex}`;
        context.fillRect(x, y, 1, 1);
    }

    render(): void {
        const buffer = Block.SIZE;
        if (
            this.point.x + Block.SIZE > PixelGrid.left() &&
            this.point.x < PixelGrid.right() &&
            this.point.y + Block.SIZE > PixelGrid.top() &&
            this.point.y < PixelGrid.bottom()
        ) {
            PixelGrid.render_block(this);
        } else {
            this.debug_element?.remove();
            if (
                this.point.x + Block.SIZE + buffer < PixelGrid.left() ||
                this.point.x - buffer > PixelGrid.right() ||
                this.point.y + Block.SIZE + buffer < PixelGrid.top() ||
                this.point.y - buffer > PixelGrid.bottom()
            ) {
                // console.log(`unsub ${this.point.block_id()}`);
                this.unsubscribe();
            }
        }
    }
}
