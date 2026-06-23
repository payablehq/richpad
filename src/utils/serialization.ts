import type { Editor, JSONContent } from '@tiptap/react';

// ─── HTML ─────────────────────────────────────────────────────────────────────

export function toHTML(editor: Editor): string {
  return editor.getHTML();
}

export function fromHTML(html: string): string {
  return html;
}

// ─── JSON ─────────────────────────────────────────────────────────────────────

export function toJSON(editor: Editor): JSONContent {
  return editor.getJSON();
}

export function fromJSON(json: JSONContent): JSONContent {
  return json;
}

// ─── Plain Text ───────────────────────────────────────────────────────────────

export function toText(editor: Editor): string {
  return editor.getText();
}

// ─── Markdown ─────────────────────────────────────────────────────────────────
// Basic Markdown export — converts common nodes to Markdown syntax.
// For full fidelity, use a dedicated Markdown extension.

export function toMarkdown(editor: Editor): string {
  const json = editor.getJSON();
  return jsonToMarkdown(json);
}

function jsonToMarkdown(node: JSONContent): string {
  if (!node) return '';

  const lines: string[] = [];

  if (node.content) {
    for (const child of node.content) {
      lines.push(nodeToMarkdown(child));
    }
  }

  return lines.join('\n');
}

function nodeToMarkdown(node: JSONContent, depth = 0): string {
  switch (node.type) {
    case 'paragraph':
      return inlineContent(node) + '\n';

    case 'heading': {
      const level = node.attrs?.level || 1;
      return '#'.repeat(level) + ' ' + inlineContent(node) + '\n';
    }

    case 'bulletList':
      return (node.content || [])
        .map((li) => '- ' + listItemContent(li, depth))
        .join('\n') + '\n';

    case 'orderedList':
      return (node.content || [])
        .map((li, i) => `${i + 1}. ` + listItemContent(li, depth))
        .join('\n') + '\n';

    case 'taskList':
      return (node.content || [])
        .map((li) => {
          const checked = li.attrs?.checked ? 'x' : ' ';
          return `- [${checked}] ` + listItemContent(li, depth);
        })
        .join('\n') + '\n';

    case 'blockquote':
      return (node.content || [])
        .map((child) => '> ' + nodeToMarkdown(child, depth).trimEnd())
        .join('\n') + '\n';

    case 'codeBlock': {
      const lang = node.attrs?.language || '';
      const code = node.content?.map((c) => c.text || '').join('') || '';
      return '```' + lang + '\n' + code + '\n```\n';
    }

    case 'horizontalRule':
      return '---\n';

    case 'image':
      return `![${node.attrs?.alt || ''}](${node.attrs?.src || ''})\n`;

    case 'table':
      return tableToMarkdown(node) + '\n';

    default:
      return inlineContent(node) + '\n';
  }
}

function listItemContent(node: JSONContent, depth: number): string {
  if (!node.content) return '';
  return node.content.map((child) => {
    if (child.type === 'paragraph') return inlineContent(child);
    if (child.type === 'bulletList' || child.type === 'orderedList' || child.type === 'taskList') {
      const indent = '  '.repeat(depth + 1);
      return '\n' + nodeToMarkdown(child, depth + 1)
        .split('\n')
        .map((line) => (line.trim() ? indent + line : ''))
        .join('\n');
    }
    return nodeToMarkdown(child, depth);
  }).join('');
}

function inlineContent(node: JSONContent): string {
  if (!node.content) return '';
  return node.content.map((child) => {
    let text = child.text || '';
    if (child.marks) {
      for (const mark of child.marks) {
        switch (mark.type) {
          case 'bold':
          case 'strong':
            text = `**${text}**`;
            break;
          case 'italic':
          case 'em':
            text = `*${text}*`;
            break;
          case 'strike':
            text = `~~${text}~~`;
            break;
          case 'code':
            text = `\`${text}\``;
            break;
          case 'link':
            text = `[${text}](${mark.attrs?.href || ''})`;
            break;
        }
      }
    }
    return text;
  }).join('');
}

function tableToMarkdown(node: JSONContent): string {
  if (!node.content) return '';
  const rows = node.content.filter((r) => r.type === 'tableRow');
  if (rows.length === 0) return '';

  const mdRows: string[] = [];
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].content || [];
    const rowStr = '| ' + cells.map((cell) => {
      const p = cell.content?.[0];
      return p ? inlineContent(p) : '';
    }).join(' | ') + ' |';
    mdRows.push(rowStr);

    // Add separator after header row
    if (i === 0) {
      const sep = '| ' + cells.map(() => '---').join(' | ') + ' |';
      mdRows.push(sep);
    }
  }
  return mdRows.join('\n');
}
