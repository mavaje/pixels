import {register_listeners} from "./listeners";
import {Toolbox} from "./toolbox";
import {Picker} from "./picker";
import {Palette} from "./palette";
import {Favicon} from "./favicon";
import {CONFIG} from "./config";

console.log(CONFIG.version);

Favicon.cycle();

register_listeners();

Toolbox.initialise();
Palette.initialise();
Picker.initialise();
