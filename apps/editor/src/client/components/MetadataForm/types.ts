import type { PostFrontmatter, RfcFrontmatter } from '@arcjr/content';

export interface PostMetadataFormHandle {
  submit: () => Promise<PostFrontmatter | null>;
}

export interface PostMetadataFormProps {
  values: PostFrontmatter;
  imageOptions: string[];
  onDirtyChange?: (dirty: boolean) => void;
}

export interface RfcMetadataFormHandle {
  submit: () => Promise<RfcFrontmatter | null>;
}

export interface RfcMetadataFormProps {
  values: RfcFrontmatter;
  onDirtyChange?: (dirty: boolean) => void;
}
