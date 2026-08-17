export interface AnchorTooltipProps {
  className?: string;
  id?: string;
  children: React.ReactNode;
  /** CSS anchor name. The leading `--` is optional. */
  anchor: string;
  visible: boolean;
}
