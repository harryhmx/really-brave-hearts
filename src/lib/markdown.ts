import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({
  breaks: true,
  gfm: true,
});

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "ul", "ol", "li",
  "strong", "em", "code", "pre",
  "a", "img", "blockquote", "hr", "iframe",
];

const ALLOWED_ATTR = [
  "href", "src", "alt", "class", "width", "height",
  "frameborder", "allow", "allowfullscreen",
];

export function renderMarkdown(content: string): string {
  if (!content) return "";
  const rawHtml = marked.parse(content) as string;
  return DOMPurify.sanitize(rawHtml, { ALLOWED_TAGS, ALLOWED_ATTR });
}
