import { inspect } from "util";

export const debugConfig = (config) => {
    console.debug('############### START WEBPACK CONFIGURATION ###############');
    console.debug(inspect(config, true, 8, true));
    console.debug('############### END WEBPACK CONFIGURATION ###############');
};