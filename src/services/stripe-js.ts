import { loadStripe } from "@stripe/stripe-js";

export async function getStripeJs() {
  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
    : "";
  const stripejs = await loadStripe(stripePublicKey);

  return stripejs;
}
