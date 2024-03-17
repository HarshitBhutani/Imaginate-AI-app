import OpenAI from 'openai';
import {auth} from "@clerk/nextjs";
import { NextResponse } from "next/server";
import {increaseApiLimit, checkApiLimit} from "@/lib/api-limit";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});
const instructionMessage = {  // This is telling the AI how to behave with the same API as used in conversation
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
}
export async function POST(req){
    try{
        const {userId} = auth();
        const body = await req.json();
        const {messages} = body;

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }
        // if(!configuration.apiKey){
        //     return new NextResponse("OpenAI API Key not configured", {status: 500});
        // }

        if(!messages){
            return new NextResponse("Messasges are required", {status:400});
        }
        
        const freeTrial = await checkApiLimit();
        if(!freeTrial){
            return new NextResponse("Free trial has expired.", {status: 403})
        }
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages : [instructionMessage, ...messages]
        });
        
        await increaseApiLimit();    // after we did a response increase by 1

          console.log(chatCompletion.choices[0].message);
          return NextResponse.json(chatCompletion.choices[0].message.content);

    } catch(error){
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}
