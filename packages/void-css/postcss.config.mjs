import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export default {
  plugins: [
    // Tailwind MUST be first - it generates the utility classes
    tailwindcss({}),
    // Autoprefixer adds vendor prefixes
    autoprefixer({
      overrideBrowserslist: ["> 1%", "last 2 versions", "not dead"],
    }),
    // cssnano minifies (only in production ideally, but fine for build)
    cssnano({
      preset: [
        "default",
        {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
        },
      ],
    }),
  ],
};
