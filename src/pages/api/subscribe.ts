import { fauna } from "@/services/fauna";
import { stripe } from "@/services/stripe";
import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const stripeUrl = {
    success_url: process.env.STRIPE_SUCCESS_URL
      ? process.env.STRIPE_SUCCESS_URL
      : "",
    cancel_url: process.env.STRIPE_CANCEL_URL
      ? process.env.STRIPE_CANCEL_URL
      : "",
  };

  if (req.method === "POST") {
    const session = await getSession({ req });
    const userEmail = session?.user?.email ?? "";

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(userEmail)))
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustumer = await stripe.customers.create({
        email: session?.user?.email ? session.user.email : "",
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustumer.id,
          },
        })
      );

      customerId = stripeCustumer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: "price_1MqloVACnR4wCFpfLk9nqT1Z",
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: stripeUrl.success_url,
      cancel_url: stripeUrl.cancel_url,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
