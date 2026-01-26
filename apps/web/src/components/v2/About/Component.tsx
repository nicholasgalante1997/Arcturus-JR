import { memo } from "react";

import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";

import V2AboutPageView from "./View";

function V2AboutPage() {
  // Static page - no data fetching needed
  return <V2AboutPageView />;
}

export default pipeline(withProfiler("v2_About_Page"), memo)(V2AboutPage);
