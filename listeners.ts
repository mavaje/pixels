import {PixelGrid} from "./pixel-grid";
import {Point} from "./point";
import {Toolbox} from "./toolbox";
import {Picker} from "./picker";
import {FEATURE} from "./config";

const download_anchor = document.getElementById('downloader') as HTMLAnchorElement;

const glasses = document.getElementsByClassName('glass') as HTMLCollectionOf<HTMLElement>;

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
        PixelGrid.centre = Point.grid(x, y);
        if (!isNaN(z)) {
            PixelGrid.set_size(z);
        } else {
            PixelGrid.render();
        }
    }
}

let active_button = null;
let last_point: Point = null;

let pointers: {
    [id: string]: Point[];
} = {};

function on_touch(event: PointerEvent) {
    active_button = event.button;
    const point = Point.view(event.x, event.y);

    document.body.classList.add('dragging');

    const tool = Toolbox.active_tool();
    if (!FEATURE.touch_controls || event.pointerType !== 'touch') {
        tool.on_drag(event.button, point);
    }

    last_point = point;
    pointers[event.pointerId] = [point];
}

function on_move(event: PointerEvent) {
    const point = Point.view(event.x, event.y);

    pointers[event.pointerId] ??= [];
    pointers[event.pointerId].unshift(point);
    pointers[event.pointerId].splice(2);

    const tool = Toolbox.active_tool();

    if (active_button !== null) {
        if (Object.entries(pointers).length > 1 && FEATURE.touch_controls) {
            const valid_pointers = Object.values(pointers).filter(p => p.length >= 2);

            const centre = Point.average(valid_pointers.map(p => p[0]));
            const last_centre = Point.average(valid_pointers.map(p => p[1]));

            console.log(valid_pointers);
            console.log(centre, last_centre);

            const move_by = last_centre.minus(centre).scale(1 / valid_pointers.length).grid();
            console.log('move by', move_by);
            PixelGrid.move_by(move_by);

            if (valid_pointers.length >= 2) {
                const pinch = valid_pointers[0][0].minus(valid_pointers[1][0]).distance();
                const last_pinch = valid_pointers[0][1].minus(valid_pointers[1][1]).distance();
                console.log('scale by =', pinch, '/', last_pinch, '=', pinch / last_pinch);
                PixelGrid.scale_by(pinch / last_pinch, centre);
            }
        } else {
            tool.on_drag(active_button, point, last_point);
        }

        for (const glass of glasses) {
            const {x, y, width, height} = glass.getBoundingClientRect();
            if (Object.values(pointers).some(([point]) =>
                point.x > x - 16 && point.x < x + width + 16 &&
                point.y > y - 16 && point.y < y + height + 16
            )) {
                glass.style.opacity = '0%';
            } else {
                glass.style.opacity = null;
            }
        }
    }

    const preview_visible = event.target === PixelGrid.canvas
        && event.pointerType !== 'touch'
        && tool.preview_visible();
    PixelGrid.update_preview(preview_visible, point);

    last_point = point;
}

function on_leave(event: PointerEvent) {
    PixelGrid.update_preview(false, null);
}

function on_lift(event: PointerEvent) {
    if (active_button !== null) {
        Toolbox.active_tool().on_drag(active_button, last_point);
    }

    delete pointers[event.pointerId];
    if (Object.entries(pointers).length === 0) {
        active_button = null;
        document.body.classList.remove('dragging');

        for (const glass of glasses) {
            glass.style.opacity = null;
        }
    }
}

function on_scroll(event: WheelEvent) {
    event.preventDefault();

    const origin = Point.view(event.x, event.y);
    const delta = Point.view(
        event.deltaX,
        event.deltaY,
        0,
    );

    const tool = Toolbox.active_tool();

    if (event.ctrlKey || event.metaKey) {
        PixelGrid.zoom_by(event.deltaY, origin);
    } else {
        const start = origin.grid();
        PixelGrid.move_by(delta);
        const end = origin.grid();
        if (active_button) tool.on_drag(active_button, end, start);
    }

    const preview_visible = event.target === PixelGrid.canvas
        && tool.preview_visible();
    PixelGrid.update_preview(preview_visible, origin);
}

function on_key_down(event: KeyboardEvent) {
    if (event.target === Picker.hex_input) return;

    switch (event.key) {
        case '1':
        case '2':
        case '3':
            Toolbox.set_active(Toolbox.tools[Number.parseInt(event.key) - 1]);
            break;

        case 'ArrowLeft':
            PixelGrid.move_by(Point.view(-16, 0, 0));
            break;
        case 'ArrowRight':
            PixelGrid.move_by(Point.view(16, 0, 0));
            break;
        case 'ArrowUp':
            PixelGrid.move_by(Point.view(0, -16, 0));
            break;
        case 'ArrowDown':
            PixelGrid.move_by(Point.view(0, 16, 0));
            break;

        case 's':
            if (event.ctrlKey || event.metaKey) {
                download_anchor.href = PixelGrid.canvas.toDataURL();
                download_anchor.click();
                event.preventDefault();
            }
            break;
    }

    Toolbox.tools.forEach(tool => {
        if (tool.hotkey === event.key) {
            Toolbox.set_hot(tool);
        }
    });

    Toolbox.update_cursor();
}

function on_key_up(event: KeyboardEvent) {
    if (event.key === Toolbox.hot?.hotkey) {
        Toolbox.set_hot(null);
    }

    Toolbox.update_cursor();
}

export function register_listeners() {
    window.addEventListener('resize', on_resize);
    window.addEventListener('hashchange', on_hash);

    PixelGrid.canvas.addEventListener('pointerdown', on_touch);
    document.addEventListener('pointermove', on_move);
    PixelGrid.canvas.addEventListener('pointerleave', on_leave);
    document.addEventListener('pointerup', on_lift);
    document.addEventListener('pointercancel', on_lift);
    PixelGrid.canvas.addEventListener('wheel', on_scroll, {passive: false});

    document.addEventListener('keydown', on_key_down);
    document.addEventListener('keyup', on_key_up);

    document.addEventListener('contextmenu', event => event.preventDefault());

    window.addEventListener('blur', () => Toolbox.set_hot(null));

    on_resize();
    on_hash();
}
