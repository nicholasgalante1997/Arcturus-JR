import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

// Custom CodeMirror theme derived from the @arcjr/void-tokens palette so the
// editor pane sits on #0a0a0a and shares the app's azure accent — replaces the
// off-palette bluish oneDark.
const BG = '#0a0a0a';
const TEXT = '#e8e8e8';
const MUTED = '#808080';
const SUBTLE = '#a0a0a0';
const ACCENT = '#3a86ff';
const SUCCESS = '#3fb950';
const SELECTION = 'rgba(58, 134, 255, 0.25)';
const ACTIVE_LINE = 'rgba(255, 255, 255, 0.03)';

export const arcjrEditorTheme = EditorView.theme(
  {
    '&': {
      color: TEXT,
      backgroundColor: BG,
      height: '100%',
      fontSize: '14px'
    },
    '.cm-content': {
      caretColor: ACCENT,
      fontFamily: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace",
      padding: '16px 0'
    },
    '.cm-scroller': {
      fontFamily: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace",
      lineHeight: '1.6'
    },
    '&.cm-focused': { outline: 'none' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: ACCENT },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: SELECTION
    },
    '.cm-activeLine': { backgroundColor: ACTIVE_LINE },
    '.cm-gutters': {
      backgroundColor: BG,
      color: MUTED,
      border: 'none'
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
      color: SUBTLE
    },
    '.cm-lineNumbers .cm-gutterElement': { padding: '0 12px 0 16px' },
    '.cm-foldPlaceholder': {
      backgroundColor: '#1a1a1a',
      border: 'none',
      color: MUTED
    }
  },
  { dark: true }
);

const arcjrHighlightStyle = HighlightStyle.define([
  { tag: [t.heading, t.heading1, t.heading2, t.heading3], color: '#ffffff', fontWeight: '600' },
  { tag: t.strong, color: '#ffffff', fontWeight: '600' },
  { tag: t.emphasis, color: TEXT, fontStyle: 'italic' },
  { tag: [t.link, t.url], color: ACCENT, textDecoration: 'underline' },
  { tag: [t.monospace], color: SUCCESS },
  { tag: t.quote, color: SUBTLE, fontStyle: 'italic' },
  { tag: [t.list, t.processingInstruction, t.meta, t.contentSeparator], color: MUTED },
  { tag: [t.keyword], color: ACCENT },
  { tag: [t.comment], color: MUTED, fontStyle: 'italic' }
]);

export const arcjrSyntaxHighlighting = syntaxHighlighting(arcjrHighlightStyle);
