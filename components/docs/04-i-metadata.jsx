import MarkdownPage from './MarkdownPage';
export default function MetadataDoc() {
  // Use absolute path so Vite glob in MarkdownPage can load raw content and GFM tables render
    return <MarkdownPage filePath="/public/chapters/04-i-metadata.md" />;
}
