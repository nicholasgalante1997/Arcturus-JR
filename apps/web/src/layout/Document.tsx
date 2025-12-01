import React from 'react';

import { pipeline } from '@/utils/pipeline';

interface DocumentProps extends React.PropsWithChildren {
  styles?: React.ReactNode[];
}

function Document({ children, styles }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nick&apos;s Software Engineering Posts</title>
        <meta
          name="description"
          content="Nick's technical blog website. Serious about Rust and Modern Javascript/Web Development initiatives. An unserious effort to join the IndieWeb."
        />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="manifest" href="/site.webmanifest" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css"
        />

        {styles}
      </head>
      <body>
        <div id="arc_root">{children}</div>
      </body>
    </html>
  );
}

export default pipeline(React.memo)(Document) as React.MemoExoticComponent<typeof Document>;
