export interface ImagePickerProps {
  options: string[];
  value: string;
  onChange: (src: string) => void;
}
