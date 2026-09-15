import {Slider} from "./slider";
import {PixelGrid} from "./pixel-grid";

export class ZoomSlider extends Slider {

    on_slide(event: PointerEvent, animate: boolean = true) {
        super.on_slide(event, animate);

        const min_value = Math.log(PixelGrid.min_scale()) / Math.log(1.01);
        const max_value = Math.log(PixelGrid.max_scale()) / Math.log(1.01);

        let zoom = this.value * min_value + (1 - this.value) * max_value;

        const scale = 1.01 ** zoom;

        PixelGrid.set_scale(scale);
    }

    sync_value() {
        const min_value = Math.log(PixelGrid.min_scale()) / Math.log(1.01);
        const max_value = Math.log(PixelGrid.max_scale()) / Math.log(1.01);

        const zoom = Math.log(PixelGrid.scale) / Math.log(1.01);

        const value = (max_value - zoom) / (max_value - min_value);

        this.update_value(value, true);
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
