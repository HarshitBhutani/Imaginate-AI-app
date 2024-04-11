import {auth, currentUser} from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb";
import {stripe} from "@/lib/stripe";
import {absoluteUrl} from "@/lib/utils"

const settingsUrl = absoluteUrl("/settings");

export async function GET(){
    try{
        const {userId} = auth();
        const user = await currentUser();

        if(!userId || !user){
            console.log('In thus error Auth ID');
            return new NextResponse("Unauthorized", {status: 401});
        }
        const userSubscription = await prismadb.userSubscription.findMany({
            where: { userId }
        });

        // if there is already an subscription for the user then redirect to billing page(where one can cancel or upgrade more)
        if(userSubscription && userSubscription.stripeCustomerId){
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url : settingsUrl,
            });

            return new NextResponse(JSON.stringify({url : stripeSession.url}));
        }

        // if user does not have a account then redirect to checkout page
        const stripeSession = await stripe.checkout.sessions.create({
            success_url : settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection : "auto",
            customer_email : user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data : {
                        currency: "INR",
                        product_data : {
                            name: "Imaginate Pro",
                            description: "Unlimited use of Imaginate",
                        },
                        unit_amount: 9999,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1,
                }
            ],
            metadata: {  // to keep of which user purchased
                userId,  
            },
        });

        return new NextResponse(JSON.stringify({url: stripeSession.url}));
    }
    catch(error){
        console.log("[STRIPE_ERROR] ", error);
        return new NextResponse("Internal error ", {status: 500});
    }
}