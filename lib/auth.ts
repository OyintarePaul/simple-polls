import { auth } from '@clerk/nextjs/server'; // or your auth provider
import { redirect } from 'next/navigation';
import { cache } from "react"

/**
 * Validates the user session. 
 * Redirects to sign-in if unauthenticated, otherwise returns the verified userId.
 */
export const requireAuth = cache(async (): Promise<string> => {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    return userId;
})