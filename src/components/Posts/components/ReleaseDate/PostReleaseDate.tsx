import { PostReleaseDateProps } from './types';

function PostReleaseDate({ post }: PostReleaseDateProps) {
  return (
    <span className="article-date">
      <time dateTime={post.date}>
        {new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </time>
    </span>
  );
}

export default PostReleaseDate;
