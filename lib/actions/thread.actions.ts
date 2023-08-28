"use server"
import { revalidatePath } from "next/cache";

import User from "../models/user.model";
import Thread from "../models/thread.model"; 
import { connectToDb } from "../mongoose"

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createThread({ text, author, communityId, path}: Params) {
    try {
        connectToDb();
        const createdThread = await Thread.create({
            text,
            author, 
            community: null,
        })

        await User.findByIdAndUpdate( author, {
            $push: { threads: createdThread._id },
        })

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Failed to create thread: ${error.message}`);
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    try {
        // Calculate the number of posts to skip based on the page number and page size.
        const skipAmount = (pageNumber - 1) * pageSize;

        connectToDb()
        // fetch posts with no parents (aka posts and not comments)
        const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: 'desc'})
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: "author", model: User })
            .populate({
                path: "children", // Populate the children field
                populate: {
                  path: "author", // Populate the author field within children
                  model: User,
                  select: "_id name parentId image", // Select only _id and username fields of the author
                },
            });

        const totalPostsCount = await Thread.countDocuments({parentId: { $in: [null, undefined]}})

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length;
      
        return { posts, isNext };

    } catch (error) {
        throw new Error(`Failed to fetch threads`);

    }
}

export async function fetchThreadById(id: string){
    connectToDb();
    try {
        const thread = await Thread.findById(id)
            .populate({ path: "author", model: User, select: "_id id name image" })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id name image'
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id id name image' 
                        }
                    }
                ]
            }).exec();

        return thread;

    } catch (error: any)  {
        throw new Error(`Error fetching thread: ${error.message}`);
    }
} 

export async function addCommentToThread( 
    threadId: string, 
    commentText: string, 
    userId: string,
    path: string
) {
    connectToDb();
    try {
        const originalThread = await Thread.findById(threadId);
        if(!originalThread) {
            throw new Error('Thread not found');
        }
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })

        const savedCommentThread = await commentThread.save();
        originalThread.children.push(savedCommentThread._id);

        await originalThread.save();
        revalidatePath(path)
    } catch (error: any)  {
        throw new Error(`Error adding comment to thread: ${error.message}`);

    }
}