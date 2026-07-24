import type { ViewMode } from '../ViewToggle';

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'markdown' | 'plain';
  viewMode?: ViewMode;
}
