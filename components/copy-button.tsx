'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Check, CheckCircle2 } from 'lucide-react';

interface CopyButtonProps extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {
  valueToCopy: string;
  successTitle?: string;
  successDescription?: string;
  showText?: boolean;
}

export default function CopyButton({
  valueToCopy,
  successTitle = 'Link Copied',
  successDescription = 'The target URL has been written to your clipboard.',
  showText = true,
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

    try {
      await navigator.clipboard.writeText(valueToCopy);
      setHasCopied(true);

      // Trigger your global Sonner pipeline alert
      toast.success(successTitle, {
        description: successDescription,
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      });
    } catch (err) {
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
      className={`h-9 font-medium select-none gap-1.5 transition-all duration-200 ${
        hasCopied 
          ? 'border-emerald-500/30 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-500/20' 
          : 'border-slate-200 text-slate-700 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300'
      } ${className}`}
      {...props}
    >
      {hasCopied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-scale-in" />
          {showText && <span className="hidden sm:inline transition-all">Copied!</span>}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 transition-all" />
          {showText && <span className="hidden sm:inline transition-all">Copy Link</span>}
        </>
      )}
    </Button>
  );
}