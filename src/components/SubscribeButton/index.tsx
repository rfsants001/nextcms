import { signIn, useSession } from "next-auth/react";
import styles from "./styles.module.scss";
import { getStripeJs } from "@/services/stripe-js";
import { useRouter } from "next/router";

interface SubscribeButtonProps {
  priceId: string;
}

interface SessionProps {
  user: {
    name: string;
    email: string;
    image: string;
  };
  expires: string;
  activeSubscription: {
    ref: { "@ref": [Object] };
    ts: number;
    data: {
      id: string;
      userId: [Object];
      status: string;
      price_id: string;
    };
  };
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }
    const sessionData = session as SessionProps;

    if (sessionData.activeSubscription) {
      router.push("/posts");
      return;
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const sessionId = data.sessionId;

        const stripe = await getStripeJs();

        await stripe?.redirectToCheckout({ sessionId });
      } else {
        throw new Error("Erro ao realizar a assinatura.");
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
