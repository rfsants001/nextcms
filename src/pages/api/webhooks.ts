import { stripe } from "@/services/stripe";
import { NextApiRequest, NextApiResponse } from "next";

import { Readable } from "stream";
import Stripe from "stripe";
import { saveSubscription } from "./_lib/manageSubscription";

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

function readableStreamToString(stream: Readable): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let data = "";
    stream.setEncoding("utf8");
    stream.on("data", (chunk: string) => (data += chunk));
    stream.on("end", () => resolve(data));
    stream.on("error", (err: Error) => reject(err));
  });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const readble = req;

  if (req.method === "POST") {
    const data = await readableStreamToString(readble);

    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        data,
        secret ?? "",
        process.env.STRIPE_WEBHOOK_SECRET ?? ""
      );
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "customer.subscription.updated":
          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            );

            break;
          }

          case "checkout.session.completed": {
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;
            await saveSubscription(
              checkoutSession.subscription?.toString() ?? "",
              checkoutSession.customer?.toString() ?? "",
              true
            );
            break;
          }
          default:
            throw new Error("Unhandled event.");
        }
      } catch (err) {
        return res.json({ error: "Webhook handle failed." });
      }
    }
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
