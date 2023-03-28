import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | Next CMS</title>
      </Head>
      <main className={styles.main}>Teste</main>
    </>
  );
}
