import React from 'react';
import { useParams } from 'react-router';

import { DQUI } from '@/components/DeferredQueryUI';
import { useGetPost } from '@/hooks/usePost';

import PostMinorInfo from '../components/MinorInfo/PostMinorInfo';

function PostPage() {
  const params = useParams();
  const postId = params?.id;

  return (
    <article className="post">
      <section className="article-container">
        <article className="article-root">
          {/* InfoContainer */}

          <div className="article-title-container text-container">
            <h1 className="article-title">{post.title}</h1>
          </div>

          <div className="article-description-container text-container">
            <p className="article-description noto-serif">{post.excerpt}</p>
          </div>

          <div className="article-author-container text-container">
            <div className="article-author-info">
              <img
                height="48"
                width="48"
                src="/assets/doodles-ember.avif"
                alt="Nick's Avatar, a class photo of Butters Stotch against a pink background"
                className="post-card__author-avatar"
              />
              <p className="article-author noto-serif">
                By
                <a href="/about" className="post-card__author" data-link>
                  Nick G.
                </a>
              </p>
            </div>
          </div>

          <div className="article-headline-image-container" style="border-radius: 20px;overflow: hidden;">
            <img
              id="post-headline-image"
              src="${post.image.src}"
              alt="${post.image.alt}"
              height="260"
              width="100%"
              style="aspect-ratio: ${post.image.aspectRatio}; object-fit: contain; object-position: center; image-orientation: from-image; image-rendering: optimizeQuality; border-radius: 8px;"
            />
          </div>

          <section className="post-content markdown-content article__markdown-root">
            ${post.$markdown.asHtml()}
          </section>
        </article>
      </section>
    </article>
  );
}

export default React.memo(PostPage);
