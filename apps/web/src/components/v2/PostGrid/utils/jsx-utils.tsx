import { Button } from '@arcjr/void-components';
import React from 'react';

const formatter = (date: string | Date) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
    typeof date === 'string' ? new Date(date) : date
  );

export const getCardHeader = (title: string, attrs?: React.HTMLProps<HTMLHeadingElement>) => (
  <div className="void-card-post-heading-container">
    <h3 {...attrs} className="void-card-post-heading">
      {title}
    </h3>
  </div>
);

export const getCardFooter = (href: string, navigate: (to: string) => void, lastUpdated: string | Date) => (
  <div className="void-card-post-footer">
    <small>
      Last Updated: <b>{formatter(lastUpdated)}</b>
    </small>
    <Button onClick={() => navigate(href)} variant="primary">
      Read More
    </Button>
  </div>
);
