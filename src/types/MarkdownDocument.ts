import fm from "front-matter";

export interface MarkdownDocument {
  markdown: string;
  fm: ReturnType<typeof fm>;
}