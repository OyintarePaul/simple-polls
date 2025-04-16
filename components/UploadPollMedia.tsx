import useImageKitUpload from "@/hooks/useImageKitUpload";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { buttonVariants } from "./ui/button";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

interface UploadPollMediaProps {
  mediaUrl: string;
  setMediaUrl: (value: string) => void;
}

export default function UploadPollMedia({
  mediaUrl,
  setMediaUrl,
}: UploadPollMediaProps) {
  const { beginUpload, progress } = useImageKitUpload();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(async () => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (!file) return;
        const res = await beginUpload(file);
        // When you use await inside a startTransition function,
        // the state updates that happen after the await are not marked as Transitions.
        // You must wrap state updates after each await in another startTransition call
        startTransition(() => {
          if (res && res.url) {
            setMediaUrl(res.url);
          }
        });
      }
    });
  };

  return (
    <>
      <Label htmlFor="media" className={buttonVariants({ variant: "default" })}>
        {isPending && <Loader2 className="h-5 w-5 animate-spin" />}
        {mediaUrl ? "Change Media" : "Upload Media"}
      </Label>
      <Input
        type="file"
        hidden
        id="media"
        onChange={handleChange}
        accept="image/*"
      />
    </>
  );
}
