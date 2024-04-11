"use client";
import { Code } from "lucide-react";
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
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { Loader } from "@/components/loader"
import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/use-pro-modal";
import {toast} from "react-hot-toast";


const CodePage = () => {
    const proModal = useProModal();

    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });
    useEffect(() => {
        console.log("in new use effect");
    }, [])
    useEffect(() => {
        console.log("Updated messages:", messages);
    }, [messages]);
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values) => {
        console.log(values);
        try {
            const userMessage = {
                role: "user",
                content: values.prompt,
            };
            const newMessages = [...messages, userMessage];

            const response = await axios.post("/api/code", {
                messages: newMessages,
            })
            const botMessage = {
                role: "assistant", // Openai supported this role not 'bot' 
                content: response.data,
            };
            setMessages((current) => [...current, userMessage, botMessage]);

            console.log("response ", response);
            console.log("userMessage ", userMessage);
            console.log("messages ", messages);
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
            <Heading title="Code Generation"
                description="Generate code using descriptive text."
                icon={Code}
                iconColor="text-green-900"
                bgColor="bg-green-900/10"
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
                                            placeholder="Simple toggle button using React hooks."
                                            {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>Generate</Button>
                        </form>
                    </Form>
                </div>
                {messages && (
                    <div className="space-y-4 mt-4">
                        {isLoading && (
                            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                                <Loader />
                            </div>
                        )}
                        {messages.length === 0 && !isLoading && (
                            <Empty label="No conversation started." />
                        )}
                        <div className="flex flex-col-reverse gap-y-3" style={{ padding: '9px', margin: '12px' }}>
                            {messages.map((message, index) => (
                                <div key={index} className={cn("p-8 w-full flex md-3 items-start gap-x-8 rounded-lg", message.role === "user" ? "bg-white border border-black/10" : "bg-muted")} style={{ padding: '7px', margin: '6px' }}>

                                    {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                    <ReactMarkdown components={{
                                        pre: ({ node, ...props }) => (
                                            <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg"> <pre {...props} /></div>
                                        ),
                                        code: ({ node, ...props }) => (
                                            <code className="bg-black/10 rounded-lg p-1" {...props} />
                                        )
                                    }}  className="text-sm overflow-hidden leading-7">
                                        {message.content || ""}
                                    </ReactMarkdown>
                                        {/* REACT MARKDOWN FOR CODE SNIPPETS */}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div >
        </div >
    )
}

export default CodePage;