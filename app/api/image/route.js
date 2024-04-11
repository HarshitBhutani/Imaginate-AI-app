import OpenAI from 'openai';
import {auth} from "@clerk/nextjs";
import { NextResponse } from "next/server";
import {increaseApiLimit, checkApiLimit} from "@/lib/api-limit";
import {checkSubscription} from "@/lib/subscription";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

export async function POST(req){
    try{
        const {userId} = auth();
        const body = await req.json();
        const {prompt, amount=1, resolution ="512x51"} = body;

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!prompt){
            return new NextResponse("Prompt are required", {status:400});
        }
        if(!amount){
            return new NextResponse("Amount is required", {status:400});
        }
        if(!resolution){
            return new NextResponse("Resolution is required", {status:400});
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();
        if(!freeTrial && !isPro){
            return new NextResponse("Free trial has expired.", {status: 403})
        }

        
        const response = await openai.images.generate({
            prompt : prompt, 
            n: parseInt(amount, 10),
            size: resolution,
        });
        
        if(!isPro){
            await increaseApiLimit();     // after we did a response increase by 1
        }

          console.log(response.data);
          return NextResponse.json(response.data);

    } catch(error){
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}
