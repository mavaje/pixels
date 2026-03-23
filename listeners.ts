import {PixelGrid} from "./pixel-grid";
import {Point} from "./point";
import {ToolBox} from "./tool-box";
import {Picker} from "./picker";
import {pan_tool} from "./pan-tool";

const download_anchor = document.getElementById('downloader') as HTMLAnchorElement;

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

let is_touching = false;
let active_button = null;
let last_point: Point = null;

let pointers: {
    [id: string]: Point[];
} = {};

function on_touch(event: PointerEvent) {
    const point = Point.view(event.x, event.y);

    is_touching = true;
    document.body.classList.add('dragging');

    if (Picker.pick_mode || event.altKey) {
        Picker.pick(point, Picker.pick_mode ? null : event.button);
    } else {
        if (event.ctrlKey || event.metaKey) {
            ToolBox.update_cursor(pan_tool);
        } else if ([0, 1, 2].includes(event.button)) {
            active_button = event.button;
            const tool = ToolBox.get_active(active_button);
            ToolBox.update_cursor(tool);
            if (event.pointerType !== 'touch') {
                tool.on_drag(point);
            }
        }

        Picker.set_editing(null);
    }

    last_point = point;
    pointers[event.pointerId] = [point];
}

function on_move(event: PointerEvent) {
    const point = Point.view(event.x, event.y);

    pointers[event.pointerId] ??= [];
    pointers[event.pointerId].unshift(point);

    if (is_touching) {
        if (Object.entries(pointers).length > 1) {
            const valid_pointers = Object.values(pointers).filter(p => p.length >= 2);
            const centre = Point.average(valid_pointers.map(p => p[0]));
            const last_centre = Point.average(valid_pointers.map(p => p[1]));
            PixelGrid.move_by(last_centre.view().minus(centre));
            if (valid_pointers.length >= 2) {
                const pinch = valid_pointers[0][0].minus(valid_pointers[1][0]).distance();
                const last_pinch = valid_pointers[0][1].minus(valid_pointers[1][1]).distance();
                PixelGrid.scale_by(pinch / last_pinch, centre);
            }
        } else if (Picker.pick_mode || event.altKey) {
            Picker.pick(point, Picker.pick_mode ? null : active_button);
        } else if (event.ctrlKey || event.metaKey) {
            PixelGrid.move_by(last_point.view().minus(point));
        } else if (active_button !== null) {
            const tool = ToolBox.get_active(active_button);
            tool.on_drag(point, last_point);
        }

        [
            ToolBox.toolbox,
            Picker.element,
        ].forEach(element => {
            const {x, y, width, height} = element.getBoundingClientRect();
            if (Object.values(pointers).every(([_, point]) =>
                point.x > x - 16 && point.x < x + width + 16 &&
                point.y > y - 16 && point.y < y + height + 16
            )) {
                element.style.opacity = '0%';
            } else {
                element.style.opacity = null;
            }
        });
    }

    if (event.target === PixelGrid.canvas) {
        PixelGrid.render_preview(point);
    }

    last_point = point;
}

function on_leave(event: PointerEvent) {
    PixelGrid.hide_preview();
}

function on_lift(event: PointerEvent) {
    if (active_button !== null) {
        ToolBox.get_active(active_button).on_drag(last_point);
    }

    delete pointers[event.pointerId];
    if (Object.entries(pointers).length === 0) {
        is_touching = false;
        active_button = null;
        document.body.classList.remove('dragging');
        ToolBox.toolbox.style.opacity = null;
        Picker.element.style.opacity = null;
    }

    if (Picker.pick_mode) {
        Picker.pick_mode = false;
        Picker.pick_tool.classList.remove('active');
    }

    ToolBox.update_cursor();
}

function on_scroll(event: WheelEvent) {
    event.preventDefault();

    const origin = Point.view(event.x, event.y);
    const delta = Point.view(
        event.deltaX,
        event.deltaY,
        0,
    );

    if (event.ctrlKey || event.metaKey) {
        PixelGrid.scale_by(event.deltaY, origin);
    } else {
        PixelGrid.move_by(delta);
    }

    PixelGrid.render_preview(origin);
}

function on_key_down(event: KeyboardEvent) {
    if (event.target !== document.body) return;

    switch (event.key) {
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
            ToolBox.set_active(ToolBox.pips[index]);
            return;
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
        case 'Control':
        case 'Meta':
            ToolBox.update_cursor(pan_tool);
            return;
        case 'Alt':
            ToolBox.picker_cursor();
            return;
        case 'c':
            if (event.ctrlKey || event.metaKey) {
                ToolBox.new_colour_pip();
                event.preventDefault();
            }
            return;
        case 's':
            if (event.ctrlKey || event.metaKey) {
                download_anchor.href = PixelGrid.canvas.toDataURL();
                download_anchor.click();
                event.preventDefault();
            }
            return;
        default:
            console.log(event.key);
    }
}

function on_key_up(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey) {
        ToolBox.update_cursor(pan_tool);
    } else if (event.altKey) {
        ToolBox.picker_cursor();
    } else {
        ToolBox.update_cursor();
    }
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

    document.addEventListener('contextmenu', event => event.preventDefault(), {passive: false});

    on_resize();
    on_hash();
}
