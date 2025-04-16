import { getImageKitParams } from "@/actions/image-kit";
import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";

import { useState } from "react";


export default function useImageKitUpload() {
  const [progress, setProgress] = useState(0);
  
  const abortController = new AbortController();

  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const params = await getImageKitParams();
      const { signature, expire, token, publicKey } = params;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const beginUpload = async (file: File) => {
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, 
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },

        abortSignal: abortController.signal,
      });
      console.log("Upload response:", uploadResponse);
      return uploadResponse
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  };

  return { beginUpload, progress };
}
