import { PostReadingTimeProps } from './types';

function PostReadingTime({ post }: PostReadingTimeProps) {
  return (
    <span className="article-series fira-sans-semibold">
      Estimated Reading Time:&nbsp;
      <b>{post.readingTime || 'Quick One'}</b>
    </span>
  );
}

export default PostReadingTime;
