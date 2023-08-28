"use client";

import * as z from "zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";


import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CommentValidation } from '@/lib/validations/thread';
import { addCommentToThread } from '@/lib/actions/thread.actions';

interface Props {
    threadId: string,
    currentUserImage: string,
    currentUserId: string,
}

const Comment = ({ threadId, currentUserImage, currentUserId }: Props ) => {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation >) => {
        await addCommentToThread( threadId, values.thread, JSON.parse(currentUserId), pathname);

        form.reset()
    };

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="mt-10 flex items-center gap-4 border-y border-y-dark-4 py-5 max-xs:flex-col">
                <FormField
                    control={form.control}
                    name='thread'
                    render={({ field }) => (
                        <FormItem className='flex w-full items-center gap-3'>
                            <FormLabel>
                                <Image
                                    src={currentUserImage}
                                    alt="Current User"
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                            </FormLabel>
                            <FormControl className='border-none bg-transparent'>
                                <Input
                                    type="text"
                                    placeholder="Comment..."
                                    className="no-focus text-light-1 outline-none"
                                {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className='rounded-3xl bg-primary-500 px-8 py-2 !text-small-regular text-light-1 max-xs:w-full'>Reply</Button>
            </form>
        </Form>
        
    )
}

export default Comment;