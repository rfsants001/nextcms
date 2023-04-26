import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SubscribeButton } from "@/components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "@/styles/Home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  const _CONTENT = ["React", "Angular", "Vue", "Svelte"];

  let _PART = 0;

  let _PART_INDEX = 0;

  let _INTERVAL_VAL: NodeJS.Timeout;

  const _ELEMENT = React.useRef<HTMLDivElement | null>(null);

  const _CURSOR = React.useRef<HTMLDivElement | null>(null);

  const Type = () => {
    const text = _CONTENT[_PART].substring(0, _PART_INDEX + 1);
    if (_ELEMENT.current) {
      _ELEMENT.current.innerHTML = text;
    }
    addColorText();
    _PART_INDEX++;

    if (text === _CONTENT[_PART]) {
      if (_CURSOR.current) {
        _CURSOR.current.style.display = "none";
      }

      clearInterval(_INTERVAL_VAL);
      setTimeout(() => {
        _INTERVAL_VAL = setInterval(Delete, 50);
      }, 1000);
    }
  };

  const Delete = () => {
    const text = _CONTENT[_PART].substring(0, _PART_INDEX - 1);
    if (_ELEMENT.current) {
      _ELEMENT.current.innerHTML = text;
    }

    _PART_INDEX--;

    if (text === "") {
      clearInterval(_INTERVAL_VAL);

      if (_PART === _CONTENT.length - 1) _PART = 0;
      else _PART++;

      _PART_INDEX = 0;

      setTimeout(() => {
        if (_CURSOR.current) {
          _CURSOR.current.style.display = "inline-block";
        }
        _INTERVAL_VAL = setInterval(Type, 100);
      }, 200);
    }
  };

  const addColorText = () => {
    switch (_CONTENT[_PART]) {
      case "React":
        if (_ELEMENT.current) {
          _ELEMENT.current.style.color = "#61dafb";
        }
        break;
      case "Angular":
        if (_ELEMENT.current) {
          _ELEMENT.current.style.color = "#AF2B2D";
        }
        break;
      case "Vue":
        if (_ELEMENT.current) {
          _ELEMENT.current.style.color = "#3FB984";
        }
        break;
      case "Svelte":
        if (_ELEMENT.current) {
          _ELEMENT.current.style.color = "#F88600";
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    _INTERVAL_VAL = setInterval(Type, 100);
    return () => {
      clearInterval(_INTERVAL_VAL);
    };
  }, []);

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
            <div className={styles.container}>
              <div className={styles.text} ref={_ELEMENT}></div>
              <div className={styles.cursor} ref={_CURSOR}></div>
            </div>
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
