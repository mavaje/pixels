import {ZoomSlider} from "./zoom-slider";

export class Controls {

    static element = document.getElementById('controls') as HTMLElement;

    static zoom_slider = new ZoomSlider('slider-zoom', 'Zoom');

    static initialise() {}
}
