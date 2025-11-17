import StyleDictionary from "style-dictionary";
import type { Config } from "style-dictionary/types";

const config: Config = {
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css",
      prefix: "void",
      buildPath: "dist/css/",
      files: [
        {
          destination: "void-tokens.css",
          format: "css/variables",
          options: {
            selector: ":root",
            outputReferences: true,
          },
        },
      ],
    },
    scss: {
      transformGroup: "scss",
      prefix: "void",
      buildPath: "dist/scss/",
      files: [
        {
          destination: "_void-tokens.scss",
          format: "scss/variables",
          options: {
            outputReferences: true,
          },
        },
        {
          destination: "_void-tokens-map.scss",
          format: "scss/map-deep",
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    js: {
      transformGroup: "js",
      buildPath: "dist/esm/",
      files: [
        {
          destination: "tokens.js",
          format: "javascript/es6",
        },
        {
          destination: "tokens.d.ts",
          format: "typescript/es6-declarations",
        },
      ],
    },
    json: {
      transformGroup: "js",
      buildPath: "dist/json/",
      files: [
        {
          destination: "tokens.json",
          format: "json/flat",
        },
        {
          destination: "tokens-nested.json",
          format: "json/nested",
        },
      ],
    },
    ios: {
      transformGroup: "ios",
      buildPath: "dist/ios/",
      files: [
        {
          destination: "VoidTokens.h",
          format: "ios/macros",
        },
        {
          destination: "VoidTokens.m",
          format: "ios/strings.m",
        },
        {
          destination: "VoidTokens.swift",
          format: "ios-swift/class.swift",
          options: {
            className: "VoidTokens",
          },
        },
      ],
    },
    android: {
      transformGroup: "android",
      buildPath: "dist/android/",
      files: [
        {
          destination: "colors.xml",
          format: "android/colors",
        },
        {
          destination: "dimens.xml",
          format: "android/dimens",
        },
        {
          destination: "font_dimens.xml",
          format: "android/fontDimens",
        },
      ],
    },
  },
};

export default config;
