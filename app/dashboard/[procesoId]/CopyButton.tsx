'use client';

import { useState } from 'react';

export default function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('input');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
        copied
          ? 'bg-green-100 text-green-700 border border-green-300'
          : 'bg-teal-600 text-white hover:bg-teal-700'
      }`}
    >
      {copied ? (
        <>✓ Enlace copiado</>
      ) : (
        <>📋 Copiar enlace de invitación</>
      )}
    </button>
  );
}
