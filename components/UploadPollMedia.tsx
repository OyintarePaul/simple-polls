import useImageKitUpload from "@/hooks/useImageKitUpload";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { buttonVariants } from "./ui/button";
import { Image } from "@imagekit/next";

interface UploadPollMediaProps {
    mediaUrl: string;
    setMediaUrl: (value: string) => void;
}

export default function UploadPollMedia({
    mediaUrl,
    setMediaUrl,
}: UploadPollMediaProps) {
    const { beginUpload } = useImageKitUpload();

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Image selected");
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!file) return;
            const res = await beginUpload(file);
            if (res && res.url) {
                console.log(res.url);
                setMediaUrl(res.url);
            }
        }
    };

    return (
        <>
            {mediaUrl && <Image src={mediaUrl} alt="poll media" width={500} height={500} />}

            <Label
                htmlFor="media"
                className={buttonVariants({ variant: "default" })}
            >
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
