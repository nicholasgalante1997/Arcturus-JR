export type ViewMode = 'editor' | 'split' | 'preview';

export interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}
