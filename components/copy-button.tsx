'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Check, CheckCircle2 } from 'lucide-react';

interface CopyButtonProps extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {
  pollId: string;
}

export default function CopyButton({
  pollId,
  className,
  variant = 'outline',
  size = 'sm',
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  // Revert back to copy icon state after a small delay
  useEffect(() => {
    if (!hasCopied) return;
    const timeout = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  const handleCopyExecution = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Avoid triggering parent item card clicks

    // 💡 THE FIX: Construct the full URL safely inside the client-side click event context
    const fullUrl = `${window.location.origin}/p/${pollId}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setHasCopied(true);

      toast.success('Share Link Copied', {
        description: 'The full poll URL has been copied to your clipboard.',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      });
    } catch {
      toast.error('Clipboard Error', {
        description: 'Device permissions blocked writing to clipboard.'
      });
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopyExecution}
      // 💡 Made this h-9 w-9 p-0 baseline to match your clean, square icon button rows on mobile layout
      className={`h-9 w-9 p-0 sm:w-auto sm:px-3 font-medium select-none gap-1.5 transition-all duration-200 ${hasCopied
        ? 'border-emerald-500/30 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-500/20'
        : 'border-slate-200 text-slate-700 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300'
        } ${className}`}
      {...props}
    >
      {hasCopied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline transition-all">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 transition-all" />
          <span className="hidden sm:inline transition-all">Copy Link</span>
        </>
      )}
    </Button>
  );
}