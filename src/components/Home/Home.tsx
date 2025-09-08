import React, { useMemo } from 'react';
import { Markdown } from '@/components/Markdown';
import { PostCardsList } from '@/components/Posts/components/List';
import { useMarkdown } from '@/hooks/useMarkdown';
import { useGetPosts } from '@/hooks/usePosts';

function Home() {
  const { data: markdownData, isLoading: markdownIsLoading, error: markdownError } = useMarkdown('/content/home.md');
  const { data: postsData, isLoading: postsIsLoading, error: postsError } = useGetPosts();
  const isLoading = useMemo(() => markdownIsLoading || postsIsLoading, [markdownIsLoading, postsIsLoading]);
  const isError = useMemo(() => markdownError || postsError, [markdownError, postsError]);
  return (
    <React.Fragment>
      <div className="markdown-content">
        <Markdown markdown={markdownData?.markdown || ''} />
      </div>
      <h2 className="recent-posts-label">Recent Posts</h2>
      <PostCardsList posts={postsData || []} />
    </React.Fragment>
  );
}

export default React.memo(Home);
