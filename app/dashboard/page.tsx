import { Button } from "@/components/ui/button";
import dbConnect from "@/db/connect"
import PollModel from "@/db/models/poll";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
    const { userId } = await auth();
    await dbConnect();
    const polls = await PollModel.find({ userID: userId })
    return <form action={async () => {
        "use server"
        console.log("Creating a new empty poll")
    }}>
        <Button>Create a new poll</Button>
    </form>

}