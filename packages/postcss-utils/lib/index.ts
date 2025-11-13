import { default as ArcPostCSSRunner } from "./models/PostCSSRunner";
import { xpostcss, getDefaultBunPostcssBundlerOptions, getPostcssProcessor, postcss } from "./postcss";
import { type BunPostCSSBundlerOptions, PostcssPlugin } from "./types";

declare namespace ArcPostCSS {
    export {
        xpostcss,
        getDefaultBunPostcssBundlerOptions,
        getPostcssProcessor,
        postcss,
        ArcPostCSSRunner,
        BunPostCSSBundlerOptions,
        PostcssPlugin
    }
}

export default ArcPostCSS;

export {
    ArcPostCSS,
    ArcPostCSSRunner,
    xpostcss,
    getDefaultBunPostcssBundlerOptions,
    getPostcssProcessor,
    postcss,
    BunPostCSSBundlerOptions,
    PostcssPlugin
}
