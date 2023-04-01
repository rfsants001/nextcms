import Head from "next/head";

import styles from "@/styles/Home.module.scss";
import Image from "next/image";
import { SubscribeButton } from "@/components/SubscribeButton";
import { GetStaticProps } from "next";
import { stripe } from "../services/stripe";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Next CMS</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋 Hey, welcome</span>
          <h1>
            News about the world of <br />
            <span>React</span>.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>
        <Image
          src="/images/hero.svg"
          width="0"
          height="0"
          style={{ width: "auto", height: "auto" }}
          alt="girl coding"
        />
      </main>
    </>
  );
}
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1MqloVACnR4wCFpfLk9nqT1Z");

  const product = {
    priceId: price.id,
    amount: (price.unit_amount! / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
