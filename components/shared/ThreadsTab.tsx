import { redirect } from "next/navigation";

import ThreadCard from "../cards/ThreadCard";
import { fetchUserPosts } from "@/lib/actions/user.actions";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
    let result = await fetchUserPosts(accountId)
    console.log
    if(!result) redirect('/')
    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread: any) => (
                <ThreadCard
                    key = {thread._id}
                    id = {thread._id}
                    currentUserId = {currentUserId}
                    parentId = {thread.parentId}
                    content = {thread.text}
                    author={
                        accountType === "User"
                          ? { name: result.name, image: result.image, id: result.id }
                          : { name: thread.author.name, image: thread.author.image, id: thread.author.id,}
                    }                    
                    community = {thread.community} //update community
                    createdAt = {thread.createdAt}
                    comments = {thread.comments}
                />
            ))}
        </section>
    )
}
export default ThreadsTab;