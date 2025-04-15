import { Button } from "./ui/button";

interface RemovePollMediaProps {
    mediaUrl: string,
    setMediaUrl: (url: string) => void
}

export default function RemovePollMedia({mediaUrl, setMediaUrl}: RemovePollMediaProps) {
    if (mediaUrl) return <Button type="button" onClick={()=> setMediaUrl("")} variant="destructive">Remove Media</Button>
    return null
}