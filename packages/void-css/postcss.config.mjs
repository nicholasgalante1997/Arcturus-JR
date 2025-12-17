import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import tailwindcss from "@tailwindcss/postcss";

export default {
  plugins: [
    autoprefixer({
      overrideBrowserslist: ["> 1%", "last 2 versions", "not dead"],
    }),
    cssnano({
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          autoprefixer: false,
        },
      ],
    }),
    tailwindcss({}),
  ],
};
