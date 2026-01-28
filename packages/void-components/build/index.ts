import * as esbuild from "esbuild";
import { ProdESMBuild } from "./config/esm";
import { ProdCJSBuild } from "./config/cjs";

export async function build() {
  console.log("esbuild process started");
  try {
    const esm = esbuild.build(ProdESMBuild);
    const cjs = esbuild.build(ProdCJSBuild);
    await Promise.all([esm, cjs]);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  console.log("Finished build");
}
