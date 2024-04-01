import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2023-10-16",
    typescript: true,
})

// const Stripe = require("stripe");

// exports.stripe = new Stripe(process.env.STRIPE_API_KEY, {
//     apiVersion: "2023-10-16",
// });