import { connection } from "next/server";

export async function FooterYear() {
    await connection()
    const year = new Date().getFullYear();
    return <>{year}</>;
}