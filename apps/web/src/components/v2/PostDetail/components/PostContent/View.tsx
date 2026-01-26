import { memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "@/components/Base/Markdown/components/CodeBlock";
import { modifiedSanitizationSchema } from "@/components/Base/Markdown/utils/rehype-sanitize";
import { pipeline } from "@/utils/pipeline";

import type { PostContentProps } from "../../types";

function PostContentView({ content }: PostContentProps) {
  return (
    <article className="v2-post-content prose">
      <ReactMarkdown
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeSanitize, modifiedSanitizationSchema]
        ]}
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock as React.ComponentType<
            React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement>
          >
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

export default pipeline(memo)(PostContentView);
