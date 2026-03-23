import {PixelGrid} from "./pixel-grid";
import {Block} from "./db/block";

type PointContext = 'grid' | 'view';

export class Point {

    private constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly w: number,
        private context: PointContext,
    ) {
        if (this.w !== 0) this.w = 1;
    }

    public static grid(x: number, y: number, w: number = 1): Point {
        return new Point(x, y, w, 'grid');
    }

    public static view(x: number, y: number, w: number = 1): Point {
        return new Point(x, y, w, 'view');
    }

    public static average(points: Point[], context: PointContext = points[0].context): Point {
        return points.reduce(
            (avg, p) => avg.plus(p),
            new Point(0, 0, 1, context),
        ).scale(1 / points.length);
    }

    public in_context(context: PointContext) {
        switch (context) {
            case 'view':
                return this.view();
            case 'grid':
                return this.grid();
        }
    }

    public grid(): Point {
        switch (this.context) {
            case 'view':
                return Point.grid(
                    this.x / PixelGrid.scale + this.w * PixelGrid.left(),
                    this.y / PixelGrid.scale + this.w * PixelGrid.top(),
                );
            case 'grid':
                return this;
        }
    }

    public view(): Point {
        switch (this.context) {
            case 'view':
                return this;
            case 'grid':
                return Point.view(
                    (this.x - this.w * PixelGrid.left()) * PixelGrid.scale,
                    (this.y - this.w * PixelGrid.top()) * PixelGrid.scale,
                );
        }
    }

    public xy(): [number, number] {
        return [this.x, this.y];
    }

    public block(): Point {
        return this.grid()
            .scale(1 / Block.SIZE)
            .floor()
            .scale(Block.SIZE);
    }

    public block_id(): string {
        return this.block().xy()
            .map(d => d / Block.SIZE)
            .join(',');
    }

    public pixel(): Point {
        return this.grid().minus(this.block()).floor();
    }

    public pixel_id(): string {
        return this.pixel().xy()
            .map(d => d.toString(16).padStart(2, '0'))
            .join('');
    }

    public hash_id(scale?: number): string {
        return `#${[
            ...this.grid().floor().xy(),
            Math.floor(scale),
        ].join(',')}`;
    }

    public floor(): Point {
        return new Point(
            Math.floor(this.x),
            Math.floor(this.y),
            this.w,
            this.context,
        );
    }

    public distance(): number {
        return Math.hypot(this.x, this.y);
    }

    public scale(s: number): Point {
        return new Point(
            this.x * s,
            this.y * s,
            this.w,
            this.context,
        );
    }

    public equals(point: Point): boolean {
        point = point.in_context(this.context);
        return this.x === point.x && this.y === point.y;
    }

    public plus(point: Point): Point;
    public plus(x: number, y: number): Point;
    public plus(x: Point | number, y?: number): Point {
        let w = 1;
        if (x instanceof Point) {
            ({x, y, w} = x.in_context(this.context));
        }
        return new Point(
            this.x + x,
            this.y + y,
            this.w + w,
            this.context,
        );
    }

    public minus(point: Point): Point;
    public minus(x: number, y: number): Point;
    public minus(x: Point | number, y?: number): Point {
        let w = 1;
        if (x instanceof Point) {
            ({x, y, w} = x.in_context(this.context));
        }
        return new Point(
            this.x - x,
            this.y - y,
            this.w - w,
            this.context,
        );
    }
}
