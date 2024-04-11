import Stripe from "stripe"
import {headers} from "next/headers";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
const { stripe } = require("@/lib/stripe");

export async function POST(req){
    const body = await req.text();
    console.log("BODDYYYY,   "  , body);
    const signature = headers().get("Stripe-Signature");

    let event;

    try{
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    }
    catch(error){
        return new NextResponse(`Webhook Error: ${error.message}`, {status: 400});
    }

    const session = event.data.object;
    if(event.type === "checkout.session.completed"){
        // console.log("Stripe,,,,,,, ", stripe);
        // console.log("Stripe,,,,,,, ", stripe.subscription);
        const subscription = await stripe.subscriptions.retrieve(session.subscription);

        if(!session?.metadata?.userId){
            return new NextResponse("Userid is required", {status: 400});
        }

        await prismadb.userSubscription.create({
            data: {
                userId: session?.metadata?.userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end*1000),
            }
        })
    }

    if(event.type === "invoice.payment_succeeded"){
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        console.log("SUBSCRIPTION,,,,, " , subscription);
        await prismadb.userSubscription.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end* 1000),
            },
        });
    }

    return new NextResponse(null, {status: 200});
}

// stripe listen --forward-to localhost:3000/api/webhook