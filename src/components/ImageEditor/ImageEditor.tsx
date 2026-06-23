import { useState, useRef, useEffect, useCallback } from 'react';
import { Image as ImageIcon, X, Check, UploadCloud } from 'lucide-react';
import './ImageEditor.css';

interface ImageEditorProps {
  onSubmit: (url: string) => void;
  onCancel: () => void;
  initialUrl?: string;
}

export function ImageEditor({ onSubmit, onCancel, initialUrl = '' }: ImageEditorProps) {
  const [url, setUrl] = useState(initialUrl);
  const [isValidImage, setIsValidImage] = useState<boolean | null>(null);
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

  // Check if URL is valid image when it changes
  useEffect(() => {
    if (!url.trim()) {
      setIsValidImage(null);
      return;
    }
    const img = new Image();
    img.onload = () => setIsValidImage(true);
    img.onerror = () => setIsValidImage(false);
    img.src = url;
  }, [url]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setUrl(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = url.trim();
    if (trimmed && isValidImage !== false) {
      onSubmit(trimmed);
    }
  }, [url, isValidImage, onSubmit]);

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
    <div className="rp-image-editor" ref={containerRef} onPaste={handlePaste}>
      <div className="rp-image-editor__input-row">
        <div className="rp-image-editor__icon">
          <ImageIcon size={14} />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="rp-image-editor__input"
          placeholder="Paste image URL or file..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Image URL or File Input"
        />
        <button
          type="button"
          className="rp-image-editor__btn rp-image-editor__btn--confirm"
          onClick={handleSubmit}
          disabled={!url.trim() || isValidImage === false}
          aria-label="Apply image"
        >
          <Check size={14} />
        </button>
        <button
          type="button"
          className="rp-image-editor__btn rp-image-editor__btn--cancel"
          onClick={onCancel}
          aria-label="Cancel"
        >
          <X size={14} />
        </button>
      </div>

      <div className="rp-image-editor__preview">
        {!url.trim() && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <UploadCloud size={24} />
            <span>Paste a URL or Image from Clipboard</span>
          </div>
        )}
        {url.trim() && isValidImage === true && (
          <img src={url} alt="Preview" />
        )}
        {url.trim() && isValidImage === false && (
          <span style={{ color: 'var(--rp-color-error)' }}>Invalid image URL</span>
        )}
        {url.trim() && isValidImage === null && (
          <span>Loading preview...</span>
        )}
      </div>
    </div>
  );
}
