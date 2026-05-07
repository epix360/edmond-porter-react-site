// Lightweight markdown → HTML converter for CMS bio/timeline content.
// Handles bold, italic, links, h1/h2/h3, and paragraphs. Intentionally
// minimal — heavier markdown features go through ReactMarkdown elsewhere.

const processInline = (text) => {
  // Bold first (**text**)
  let result = text.split('**').map((part, index) => {
    if (index % 2 === 1) return `<strong class="font-bold">${part}</strong>`;
    return part;
  }).join('');

  // Then italic (*text*)
  result = result.split('*').map((part, index) => {
    if (index % 2 === 1) return `<em class="italic">${part}</em>`;
    return part;
  }).join('');

  return result;
};

export function convertMarkdown(text) {
  if (!text) return text;

  let result = text;

  // Convert headers using string methods (no regex)
  result = result.split('\n').map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      return `<h3 class="font-headline text-2xl font-bold text-primary mb-4 mt-8">${trimmed.slice(4)}</h3>`;
    }
    if (trimmed.startsWith('## ')) {
      return `<h2 class="font-headline text-xl font-bold text-primary mb-6 mt-8">${trimmed.slice(3)}</h2>`;
    }
    if (trimmed.startsWith('# ')) {
      return `<h1 class="font-headline text-4xl font-bold text-primary mb-6 mt-8">${trimmed.slice(2)}</h1>`;
    }
    return line;
  }).join('\n');

  // Convert markdown links [text](url) to HTML with inline formatting inside
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    const processedText = processInline(linkText);
    const isExternal = /^https?:\/\//.test(url);
    const externalAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${url}"${externalAttrs} class="text-secondary hover:underline">${processedText}</a>`;
  });

  // Process remaining inline formatting (text not in links)
  result = processInline(result);

  // Split into paragraphs and wrap non-header content
  const paragraphs = result.split('\n');
  const processedParagraphs = paragraphs.map(paragraph => {
    if (!paragraph.trim()) return '';
    if (paragraph.startsWith('<h')) return paragraph;
    return `<p class="leading-relaxed max-w-2xl mx-auto md:mx-0 font-headline text-lg md:text-xl text-on-surface-variant">${paragraph}</p>`;
  })
    .join('\n')
    .replace(/<p class="leading-relaxed max-w-2xl mx-auto md:mx-0 font-headline text-lg md:text-xl text-on-surface-variant"><\/p>/g, '');

  return processedParagraphs;
}
