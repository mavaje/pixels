import {register_listeners} from "./listeners";
import {Palette} from "./palette";
import {Picker} from "./picker";

register_listeners();

Palette.initialise();
Picker.initialise();
