import { memo } from 'react';

import type { ReactNode } from 'react';

interface V2DocumentProps {
  children: ReactNode;
  title?: string;
  description?: string;
  styles?: string[];
}

/**
 * V2 Document component for React Router's document integration
 * Handles meta tags, title, and stylesheet links
 */
function V2Document({
  children,
  title = 'Arc-Jr',
  description = 'Modern blog built with React 19, TypeScript, and TanStack Query',
  styles = []
}: V2DocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <title>{title}</title>

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Base styles (always loaded) */}
        <link rel="stylesheet" href="/css/void/void.min.css" />
        <link rel="stylesheet" href="/css/void/void-tailwind.min.css" />
        <link rel="stylesheet" href="/css/layout/v2-app-layout.css" />
        <link rel="stylesheet" href="/css/components/v2-header.css" />
        <link rel="stylesheet" href="/css/components/v2-footer.css" />

        {/* Page-specific styles */}
        {styles.map((styleUrl) => (
          <link key={styleUrl} rel="stylesheet" href={styleUrl} />
        ))}
      </head>
      <body>
        {children}
        <div id="portal-root" />
      </body>
    </html>
  );
}

export default memo(V2Document);
