import debug from 'debug';

interface HTMLEmbedderConstructorOptions {
  head: string;
  body: string;
}

/**
 * @deprecated
 * @see https://bun.com/docs/api/html-rewriter#comment-operations
 */
class HTMLEmbedder {
  private static logger = debug('arc:prerenderer:html-rewriter');

  private static matchers = {
    DEHYDRATED_QUERY_CLIENT: /@tanstack\/react-query____dehydrated-query-client___html-embedding-entrypoint/,
    REACT_HYDRATION: /react\/react-dom____static-site-hydration___html-embedding-entrypoint/
  };

  private rewriter: HTMLRewriter;

  constructor(options: HTMLEmbedderConstructorOptions) {
    this.rewriter = new HTMLRewriter();
    this._initializeRewriter(options);
  }

  private _initializeRewriter({ body, head }: HTMLEmbedderConstructorOptions) {
    this.rewriter.on('*', {
      comments(comment) {
        if (HTMLEmbedder.matchers.DEHYDRATED_QUERY_CLIENT.test(comment.text)) {
          HTMLEmbedder.logger('Starting "embed-dehydration-in-document-head" subtask...');
          comment.replace(head, { html: true });
          HTMLEmbedder.logger('Finished "embed-dehydration-in-document-head" subtask...');
          return;
        }

        if (HTMLEmbedder.matchers.REACT_HYDRATION.test(comment.text)) {
          HTMLEmbedder.logger('Starting "embed-prerendered-react-app-in-document-body" subtask...');
          comment.replace(body, { html: true });
          HTMLEmbedder.logger('Finished "embed-prerendered-react-app-in-document-body" subtask...');
          return;
        }
      }
    });
  }

  transform(html: string) {
    return this.rewriter.transform(html);
  }
}

export default HTMLEmbedder;
