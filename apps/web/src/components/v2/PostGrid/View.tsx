import { Badge, Card } from '@arcjr/void-components';
import React, { memo, use } from 'react';
import { useNavigate } from 'react-router';

import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import { getCardFooter, getCardHeader } from './utils/jsx-utils';
import { type V2PostGridViewProps } from './types';

const FF = {
  SHOW_TAGS: false
} as const;

function V2PostGridView({ queries }: V2PostGridViewProps) {
  const navigate = useNavigate();
  const [postsQuery] = queries;
  const posts = use(postsQuery.promise);

  console.log('Posts', posts);

  return (
    <section className="arc-v2__post-grid">
      {posts.map((post) => (
        <Card
          key={post.id}
          header={getCardHeader(post.title)}
          footer={getCardFooter(`/v2/post/${post.slug}`, navigate, post.date)}
        >
          <p className="void-card-post-excerpt">{post.excerpt}</p>

          {FF.SHOW_TAGS && (
            <span className="void-card-post-tags">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={post.title + '_' + tag} variant="error">
                  {tag}
                </Badge>
              ))}
            </span>
          )}
        </Card>
      ))}
    </section>
  );
}

export default pipeline(memo, withProfiler('V2PostGridView'))(V2PostGridView) as typeof V2PostGridView;
