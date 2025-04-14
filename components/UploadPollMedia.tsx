import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

interface UploadPollMediaProps {
    mediaUrl: string;
    setMediaUrl: (value: string) => void;
}

export default function UploadPollMedia({
    mediaUrl,
    setMediaUrl,
}: UploadPollMediaProps) {
    return (
        <>
            {mediaUrl ? (
                <Image src={mediaUrl} alt="poll media" />
            ) : (
                <UploadButton
                    endpoint="pollMedia"
                    onClientUploadComplete={(res) => {
                        console.log("Upload complete");
                        setMediaUrl(res[0].ufsUrl);
                    }}
                    onUploadError={(error: Error) => {
                       console.log(error)
                    }}
                />
            )}
        </>
    );
}
