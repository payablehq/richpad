import { useState, useRef, useEffect, useCallback } from 'react';
import { ExternalLink, X, Check } from 'lucide-react';
import './LinkEditor.css';

interface LinkEditorProps {
  onSubmit: (url: string) => void;
  onCancel: () => void;
  initialUrl?: string;
}

export function LinkEditor({ onSubmit, onCancel, initialUrl = '' }: LinkEditorProps) {
  const [url, setUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCancel]);

  const handleSubmit = useCallback(() => {
    const trimmed = url.trim();
    if (trimmed) {
      // Auto-prepend https:// if no protocol
      const finalUrl = /^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;
      onSubmit(finalUrl);
    }
  }, [url, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  }, [handleSubmit, onCancel]);

  return (
    <div className="rp-link-editor" ref={containerRef}>
      <div className="rp-link-editor__icon">
        <ExternalLink size={14} />
      </div>
      <input
        ref={inputRef}
        type="url"
        className="rp-link-editor__input"
        placeholder="Paste or type a link..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="URL input"
      />
      <button
        type="button"
        className="rp-link-editor__btn rp-link-editor__btn--confirm"
        onClick={handleSubmit}
        disabled={!url.trim()}
        aria-label="Apply link"
      >
        <Check size={14} />
      </button>
      <button
        type="button"
        className="rp-link-editor__btn rp-link-editor__btn--cancel"
        onClick={onCancel}
        aria-label="Cancel"
      >
        <X size={14} />
      </button>
    </div>
  );
}
