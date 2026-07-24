import { Markdown } from '@web/components/Base/Markdown';

import CodeMirrorHost from './CodeMirrorHost';
import type { MarkdownEditorProps } from './types';

// RFC bodies aren't markdown (correction #8) — production renders them as a
// raw <pre>, so there's no Base/Markdown-equivalent to preview against. The
// "preview" for RFC bodies is just the same monospace text CM6 already shows,
// so no split pane / no live-preview pane for the plain-text case.
function MarkdownEditorView({ value, onChange, language, viewMode = 'split' }: MarkdownEditorProps) {
  if (language === 'plain') {
    return (
      <div className="editor-split editor-rfc-body-only">
        <div className="editor-split__pane">
          <CodeMirrorHost value={value} onChange={onChange} language="plain" />
        </div>
      </div>
    );
  }

  const showEditor = viewMode !== 'preview';
  const showPreview = viewMode !== 'editor';

  return (
    <div className="editor-split">
      {showEditor && (
        <div className="editor-split__pane">
          <CodeMirrorHost value={value} onChange={onChange} language="markdown" />
        </div>
      )}
      {showPreview && (
        <div className="editor-split__pane editor-preview">
          <Markdown markdown={value} />
        </div>
      )}
    </div>
  );
}

export default MarkdownEditorView;
