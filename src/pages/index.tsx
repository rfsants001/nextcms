import Head from "next/head";

import styles from "@/styles/Home.module.scss";
import Image from "next/image";
import { SubscribeButton } from "@/components/SubscribeButton";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | Next CMS</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br /> <span>for $9.00</span>
          </p>

          <SubscribeButton />
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
