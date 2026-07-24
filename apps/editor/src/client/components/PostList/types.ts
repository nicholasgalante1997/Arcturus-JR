export interface ListItem {
  id: string;
  title: string;
  date: string;
  visible: boolean;
}

export interface PostListProps {
  items: ListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  emptyLabel?: string;
}
