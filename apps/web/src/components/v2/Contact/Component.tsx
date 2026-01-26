import { memo } from "react";

import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";

import V2ContactPageView from "./View";

function V2ContactPage() {
  // Static page - no data fetching needed
  return <V2ContactPageView />;
}

export default pipeline(withProfiler("v2_Contact_Page"), memo)(V2ContactPage);