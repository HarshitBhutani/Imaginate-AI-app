"use client";
import { Music, Video } from "lucide-react";
import { Heading } from "../../../../components/heading";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Empty } from '@/components/empty'
import { Loader } from "@/components/loader"
import { useProModal } from "@/hooks/use-pro-modal";
import {toast} from "react-hot-toast";


const VideoPage = () => {
    const proModal = useProModal();

    const router = useRouter();
    const [video, setVideo] = useState();
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
            setVideo(undefined)
            const response = await axios.post("/api/video", values)
            setVideo(response.data[0])
            form.reset();

        } catch (error) {
            // to do premium model
            // open pro modal purchase popup ONLY if you get 403(forbidden error) ie api exhaust limit 
            if(error?.response?.status === 403){
                proModal.onOpen();
            }
            else{
                toast.error("Something went wrong")
            }
            console.log(error);
        } finally {
            console.log("in refresh finally");
            router.refresh();
        }
    }
    return (
        <div>
            <Heading title="Video Generation"
                description="Turn your prompt into video."
                icon={Video}
                iconColor="text-orange-700"
                bgColor="bg-orange-700/10"
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
                                            placeholder="Dog and his owner walking in a beautiful park on a beatiful sunny morning."
                                            {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>Video will be generated here</Button>
                        </form>
                    </Form>
                </div>

                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {!video && !isLoading && (
                        <Empty label="No video generated." />
                    )}
                    {video && (
                        <video  className="w-full aspect-video mt-8 rounded-lg border bg-black" controls>
                            <source src={video} />
                        </video>
                    )}
                </div>

            </div >
        </div >
    )
}

export default VideoPage;