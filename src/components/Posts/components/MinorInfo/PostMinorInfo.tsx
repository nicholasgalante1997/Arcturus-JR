import { PostReadingTime } from '../ReadingTime';
import { PostReleaseDate } from '../ReleaseDate';

import { PostMinorInfoProps } from './types';

function PostMinorInfo({ post }: PostMinorInfoProps) {
  return (
    <div className="article-supplementary-info-container text-container">
      <PostReleaseDate post={post} />
      <div className="article-divider"></div>
      <PostReadingTime post={post} />
    </div>
  );
}

export default PostMinorInfo;
