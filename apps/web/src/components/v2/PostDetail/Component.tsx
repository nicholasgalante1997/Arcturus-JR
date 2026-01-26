import { memo } from "react";
import { useParams } from "react-router";

import { SuspenseEnabledQueryProvider } from "@/components/Base/SEQ";
import { useGetPost, useGetRelatedPosts } from "@/hooks/usePosts";
import { pipeline } from "@/utils/pipeline";
import { withProfiler } from "@/utils/profiler";

import V2PostDetailView from "./View";

function V2PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const postQuery = useGetPost(postId!);
  const relatedPostsQuery = useGetRelatedPosts(postId!);

  return (
    <SuspenseEnabledQueryProvider>
      <V2PostDetailView queries={[postQuery, relatedPostsQuery]} />
    </SuspenseEnabledQueryProvider>
  );
}

export default pipeline(withProfiler("v2_Post_Detail"), memo)(V2PostDetail);
