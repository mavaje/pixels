import {PixelGrid} from "./pixel-grid";
import {Point} from "./point";
import {Block} from "./db/block";

function on_resize(event?: UIEvent) {
    PixelGrid.resize();
}

function on_hash(event?: HashChangeEvent) {
    const [x, y] = location.hash.slice(1).split(',').map(d => Number.parseInt(d));
    if (![x, y].some(isNaN)) {
        PixelGrid.move_to(Point.grid(x, y));
    }
}

let is_touching = false;
let is_drawing = false;
let initial_point: Point = null;
let last_point: Point = null;

function on_touch(event: PointerEvent) {
    last_point = Point.view(event.x, event.y);
    initial_point = PixelGrid.centre.plus(last_point).view();

    is_touching = true;

    if (event.ctrlKey || event.metaKey) {

    } else {
        is_drawing = true;
        Block.draw_line(last_point, last_point, '000');
    }
}

function on_drag(event: PointerEvent) {
    const point = Point.view(event.x, event.y);

    if (is_touching) {
        if (event.ctrlKey || event.metaKey) {
            PixelGrid.move_to(initial_point.minus(point));
        } else {
            if (is_drawing) Block.draw_line(last_point, point, '000');
        }
    }

    last_point = point;
}

function on_lift(event: PointerEvent) {
    is_touching = false;
    is_drawing = false;
}

function on_scroll(event: WheelEvent) {
    event.preventDefault();

    const delta = Point.grid(
        event.shiftKey ? event.deltaY : event.deltaX,
        event.shiftKey ? event.deltaX : event.deltaY,
    );

    PixelGrid.move_by(delta);
}

function on_key(event: KeyboardEvent) {
    switch (event.key) {
        case 'ArrowLeft':
            PixelGrid.move_by(Point.grid(-1, 0));
            return;
        case 'ArrowRight':
            PixelGrid.move_by(Point.grid(1, 0));
            return;
        case 'ArrowUp':
            PixelGrid.move_by(Point.grid(0, -1));
            return;
        case 'ArrowDown':
            PixelGrid.move_by(Point.grid(0, 1));
            return;
    }
}

export function register_listeners() {
    window.addEventListener('resize', on_resize);
    window.addEventListener('hashchange', on_hash);

    document.addEventListener('pointerdown', on_touch);
    document.addEventListener('pointermove', on_drag);
    document.addEventListener('pointerup', on_lift);
    document.addEventListener('pointercancel', on_lift);
    document.addEventListener('wheel', on_scroll, {passive: false});
    document.addEventListener('keydown', on_key);

    on_resize();
    on_hash();
}
