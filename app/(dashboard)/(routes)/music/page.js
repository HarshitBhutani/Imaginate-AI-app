"use client";
import { MessageSquare, Music } from "lucide-react";
import { Heading } from "../../../../components/heading";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Empty } from '@/components/empty'
import { cn } from "@/lib/utils";

import {Loader} from "@/components/loader"

const MusicPage = () => {
    const router = useRouter();
    const [music, setMusic] = useState();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });
    
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values) => {
        console.log(values);
        try {
            setMusic(undefined)
            const response = await axios.post("/api/muisc", {
                messages: newMessages,
            })
            setMusic(response.data.audio)
            form.reset();

        } catch (error) {
            // to do premium model
            console.log(error);
        } finally {
            console.log("in refresh finally");
            router.refresh();
        }
    }
    return (
        <div>
            <Heading title="Music Generation"
                description="Turn your prompt into music."
                icon={Music}
                iconColor="text-emerald-500"
                bgColor="bg-emerald-500/10"
            />
            <div className="px-4 lg:px-0">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within: shadow-sm grid grid-cols-12 gap-2">
                            <FormField name="prompt" render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading}
                                            placeholder="Piano tunes"
                                            {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>Music will be generated here</Button>
                        </form>
                    </Form>
                </div>
                {music && (
                    <div className="space-y-4 mt-4">
                        {isLoading && (
                            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                                <Loader />
                            </div>
                        )}
                        {!music && !isLoading && (
                            <Empty label="No music generated." />
                        )}
                        <div className="flex flex-col-reverse gap-y-3" style={{padding: '9px', margin: '12px'}}>
                            Muisc 
                        </div>
                    </div>
                )}
            </div >
        </div >
    )
}

export default MusicPage;