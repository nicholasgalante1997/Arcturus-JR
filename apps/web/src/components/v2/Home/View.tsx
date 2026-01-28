import React, { memo, use } from 'react';

import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import { FeaturedPosts } from './components/FeaturedPosts';
import { V2HeroWidget } from './components/HeroWidget';

import type { V2HomeViewProps } from './types';

function V2HomePageView({ queries }: V2HomeViewProps) {
  const [postsQuery] = queries;
  const posts = use(postsQuery.promise);

  return (
    <div className="v2-home-page">
      <V2HeroWidget />
      <FeaturedPosts posts={posts} limit={6} />
    </div>
  );
}

export default pipeline(memo, withProfiler('v2_Home_Page_View'))(V2HomePageView);
