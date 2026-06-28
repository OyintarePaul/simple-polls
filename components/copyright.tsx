import { connection } from "next/server";

export async function Copyright() {
    await connection()
    const year = new Date().getFullYear();
    return <p>&copy; {year} SimplePolls. All rights reserved.</p>;
}