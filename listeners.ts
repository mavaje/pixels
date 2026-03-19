import {PixelGrid} from "./pixel-grid";
import {Point} from "./point";
import {Block} from "./db/block";
import {Palette} from "./palette";
import {Picker} from "./picker";

function on_resize(event?: UIEvent) {
    PixelGrid.resize();
}

function on_hash(event?: HashChangeEvent) {
    const [x, y, z] = location.hash
        .slice(1)
        .split(',')
        .map((d, i) => i < 2
            ? Number.parseInt(d)
            : Number.parseFloat(d));
    if (![x, y].some(isNaN)) {
        PixelGrid.move_to(Point.grid(x, y));
        if (!isNaN(z)) PixelGrid.set_size(z);
    }
}

let is_touching = false;
let drawing_button = null;
let initial_point: Point = null;
let last_point: Point = null;

function on_touch(event: PointerEvent) {
    last_point = Point.view(event.x, event.y);
    initial_point = PixelGrid.centre.plus(last_point).view();

    is_touching = true;

    if (event.ctrlKey || event.metaKey) {

    } else if ([0, 1, 2].includes(event.button)) {
        drawing_button = event.button;
        Block.draw_line(last_point, last_point, Palette.get_hex(drawing_button));
    }

    Picker.set_editing(null);
}

function on_move(event: PointerEvent) {
    const point = Point.view(event.x, event.y);

    if (is_touching) {
        if (event.ctrlKey || event.metaKey) {
            PixelGrid.move_to(initial_point.minus(point));
        } else {
            if (drawing_button !== null) Block.draw_line(last_point, point, Palette.get_hex(drawing_button));
        }
    }

    last_point = point;
}

function on_lift(event: PointerEvent) {
    is_touching = false;
    drawing_button = false;
}

function on_scroll(event: WheelEvent) {
    event.preventDefault();

    const delta = Point.view(
        event.shiftKey ? event.deltaY : event.deltaX,
        event.shiftKey ? event.deltaX : event.deltaY,
        0,
    );

    if (event.ctrlKey || event.metaKey) {
        const origin = Point.view(event.x, event.y);
        PixelGrid.scale_by(event.deltaY, origin);
    } else {
        PixelGrid.move_by(delta);
    }
}

function on_key(event: KeyboardEvent) {
    switch (event.key) {
        case 'ArrowLeft':
            PixelGrid.move_by(Point.view(-16, 0, 0));
            return;
        case 'ArrowRight':
            PixelGrid.move_by(Point.view(16, 0, 0));
            return;
        case 'ArrowUp':
            PixelGrid.move_by(Point.view(0, -16, 0));
            return;
        case 'ArrowDown':
            PixelGrid.move_by(Point.view(0, 16, 0));
            return;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
            const index = (Number.parseInt(event.key) + 9) % 10;
            Palette.set_active(Palette.pips[index], 0);
            return;
        default:
            console.log(event.key);
    }
}

export function register_listeners() {
    window.addEventListener('resize', on_resize);
    window.addEventListener('hashchange', on_hash);

    PixelGrid.canvas.addEventListener('pointerdown', on_touch);
    document.addEventListener('pointermove', on_move);
    document.addEventListener('pointerup', on_lift);
    document.addEventListener('pointercancel', on_lift);
    PixelGrid.canvas.addEventListener('wheel', on_scroll, {passive: false});

    document.addEventListener('keydown', on_key);

    document.addEventListener('contextmenu', event => event.preventDefault(), {passive: false});

    on_resize();
    on_hash();
}
