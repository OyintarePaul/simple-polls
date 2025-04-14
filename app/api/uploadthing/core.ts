import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
    pollMedia: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    }).onUploadComplete(async ({ metadata, file }) => {
        console.log("file url", file.ufsUrl);
        console.log("Uploaded successfully");
        return { success: true };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;