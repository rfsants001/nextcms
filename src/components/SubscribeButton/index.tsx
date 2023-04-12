import { signIn, useSession } from "next-auth/react";
import styles from "./styles.module.scss";
import { getStripeJs } from "@/services/stripe-js";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
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
