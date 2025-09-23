import React from 'react';

import { Markdown } from '@/components/Base/Markdown';
import { pipeline } from '@/utils/pipeline';

import { PostViewProps } from './types';

function PostView({ post }: PostViewProps) {
  return (
    <article className="post">
      <section className="article-container">
        <article className="article-root">
          <div className="article-supplementary-info-container text-container">
            <span className="article-date" style={{ fontWeight: 700 }}>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </span>
            <div
              style={{
                margin: '0 8px',
                height: '4px',
                width: '4px',
                borderRadius: '2px',
                background: 'var(--secondary-color)'
              }}
            ></div>
            <span className="article-series fira-sans-semibold">
              Estimated Reading Time:&nbsp;
              <b>{post.readingTime || 'Quick One'}</b>
            </span>
          </div>

          <div className="article-title-container text-container">
            <h1 className="article-title">{post.title}</h1>
          </div>

          <div className="article-description-container text-container">
            <p className="article-description noto-serif">{post.excerpt}</p>
          </div>

          <div className="article-author-container text-container">
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
              <img
                style={{
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  imageOrientation: 'from-image',
                  imageRendering: 'auto',
                  borderRadius: '24px'
                }}
                height="48"
                width="48"
                src="/assets/doodles-ember.avif"
                alt="Nick's Avatar, a class photo of Butters Stotch against a pink background"
                className="post-card__author-avatar"
              />
              <p className="article-author noto-serif">
                By
                <a
                  style={{ color: 'var(--secondary-color)', fontWeight: '600' }}
                  href="/about"
                  className="post-card__author"
                  data-link
                >
                  Nick G.
                </a>
              </p>
            </div>
          </div>

          <div
            className="article-headline-image-container"
            style={{ borderRadius: '20px', overflow: 'hidden' }}
          >
            <img
              id="post-headline-image"
              src={post.image.src}
              alt={post.image.alt}
              height="260px"
              width="100%"
              style={{
                aspectRatio: post.image.aspectRatio,
                objectFit: 'contain',
                objectPosition: 'center',
                imageOrientation: 'from-image',
                imageRendering: 'auto' as const,
                borderRadius: '8px'
              }}
            />
          </div>
          <section className="post-content markdown-content article__markdown-root">
            <Markdown markdown={post.markdownContent.markdown} />
          </section>
        </article>
      </section>
    </article>
  );
}

export default pipeline(React.memo)(PostView) as React.MemoExoticComponent<typeof PostView>;
