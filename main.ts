import {register_listeners} from "./listeners";
import {Toolbox} from "./toolbox";
import {Picker} from "./picker";
import {Palette} from "./palette";

register_listeners();

Toolbox.initialise();
Palette.initialise();
Picker.initialise();
