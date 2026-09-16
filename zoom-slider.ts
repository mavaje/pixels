import {Slider} from "./slider";
import {PixelGrid} from "./pixel-grid";

export class ZoomSlider extends Slider {

    cached_basis: number = null;

    is_shrunk(): boolean {
        return getComputedStyle(this.element.parentElement).transform !== 'none';
    }

    basis(): number {
        if (!this.is_shrunk()) {
            this.cached_basis = super.basis();
        }

        return this.cached_basis;
    }

    on_slide(event: PointerEvent, animate: boolean = true) {
        if (this.basis() === null) return;

        super.on_slide(event, animate);

        const min_value = Math.log(PixelGrid.min_scale());
        const max_value = Math.log(PixelGrid.max_scale());

        let zoom = this.value * min_value + (1 - this.value) * max_value;

        const scale = Math.exp(zoom);

        PixelGrid.set_scale(scale, undefined, animate);
    }

    sync_value(animate: boolean = true) {
        const min_value = Math.log(PixelGrid.min_scale());
        const max_value = Math.log(PixelGrid.max_scale());

        const zoom = Math.log(PixelGrid.scale);

        const value = (max_value - zoom) / (max_value - min_value);

        this.update_value(value, animate);
    }

    tooltip(): string {
        let value = PixelGrid.scale;
        let round: string;

        if (value < 0.995) {
            round = (Math.round(value * 100) / 100).toFixed(2);
        } else if (value < 9.95) {
            round = (Math.round(value * 10) / 10).toFixed(1);
        } else {
            round = Math.round(value).toFixed(0);
        }

        return `${this.name} = ${round}×`;
    }
}
