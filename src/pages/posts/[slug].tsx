import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { RichText } from "prismic-dom";
import { createClient } from "@/services/prismic";
import styles from "./post.module.scss";
interface Params {
  slug: string;
}

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
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

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | NextCMS</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={styles.postContent}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = (await getSession({ req })) as SessionProps;
  const { slug } = params as unknown as Params;

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const prismic = createClient(req);

  const response = await prismic.getByUID("post", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
  };
};
