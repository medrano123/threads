import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { Comment } from "@/components/forms";

const Page = async ({ params }: { params: { id: string }}) => {
    if(!params.id) return null;
    const user = await currentUser();
    if(!user) return null; 

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');
    
    const thread = await fetchThreadById(params.id)
    return (
        <section className="relative">
            <div>
                <ThreadCard
                    key = {thread._id}
                    id = {thread._id}
                    currentUserId = {user?.id || ''}
                    parentId = {thread.parentId}
                    content = {thread.text}
                    author = {thread.author}
                    community = {thread.community}
                    createdAt = {thread.createdAt}
                    comments = {thread.comments}
                />
            </div> 
            <div className="mt-7">
                <Comment
                    threadId = {thread.id}
                    currentUserImage = {userInfo.image}
                    currentUserId = {JSON.stringify(userInfo._id)}
                />
            </div>
			<div className="mt-9 flex flex-col gap-6"> {/*might edit this one */}
                {thread.children.map((childItem: any) => (
                    <ThreadCard
                        key = {childItem._id}
                        id = {childItem._id}
                        currentUserId = {user?.id || ''}
                        parentId = {childItem.parentId}
                        content = {childItem.text}
                        author = {childItem.author}
                        community = {childItem.community}
                        createdAt = {childItem.createdAt}
                        comments = {childItem.comments}
                        isComment
                    />                
                    ))}
            </div>
        </section>
    )
}

export default Page;