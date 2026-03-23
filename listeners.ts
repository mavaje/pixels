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
let dragging_button = null;
let initial_point: Point = null;
let last_point: Point = null;

function on_touch(event: PointerEvent) {
    last_point = Point.view(event.x, event.y);
    initial_point = PixelGrid.centre.plus(last_point).view();

    is_touching = true;
    document.body.classList.add('dragging');

    if (Picker.pick_mode || event.altKey) {
        Picker.pick(last_point, Picker.pick_mode ? null : event.button);
    } else {
        if (event.ctrlKey || event.metaKey) {
            ToolBox.update_cursor(pan_tool);
        } else if ([0, 1, 2].includes(event.button)) {
            dragging_button = event.button;
            const tool = ToolBox.get_active(dragging_button);
            ToolBox.update_cursor(tool);
        }

        Picker.set_editing(null);
    }
}

function on_move(event: PointerEvent) {
    const point = Point.view(event.x, event.y);

    if (is_touching) {
        if (Picker.pick_mode || event.altKey) {
            Picker.pick(point, Picker.pick_mode ? null : dragging_button);
        } else if (event.ctrlKey || event.metaKey) {
            PixelGrid.move_to(initial_point.minus(point));
        } else if (dragging_button !== null) {
            const tool = ToolBox.get_active(dragging_button);
            tool.on_drag(point, last_point);
        }

        [
            ToolBox.toolbox,
            Picker.element,
        ].forEach(element => {
            const {x, y, width, height} = element.getBoundingClientRect();
            element.style.opacity =
                event.x > x - 16 && event.x < x + width + 16 &&
                event.y > y - 16 && event.y < y + height + 16
                    ? '0%'
                    : null;
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
    if (dragging_button !== null) {
        ToolBox.get_active(dragging_button).on_drag(last_point);
    }

    is_touching = false;
    dragging_button = null;
    document.body.classList.remove('dragging');
    ToolBox.toolbox.style.opacity = null;
    Picker.element.style.opacity = null;
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
