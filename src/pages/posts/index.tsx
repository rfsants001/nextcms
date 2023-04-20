import Head from "next/head";
import { GetStaticProps } from "next";
import { createClient } from "@/services/prismic";

import styles from "./styles.module.scss";
import PrismicDom from "prismic-dom";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostProps {
  posts: Post[];
}

export default function Posts({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Posts | Next CMS</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post: Post) => (
            <a href="" key={post.slug}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = createClient();

  const pages = await client.getAllByType("post", {
    fetchLinks: ["post.title", "post.content"],
    pageSize: 100,
  });

  const posts = pages.map((post) => {
    return {
      slug: post.uid,
      title: PrismicDom.RichText.asText(post.data.title),
      excerpt:
        post.data.content.find(
          (content: { type: string }) => content.type === "paragraph"
        )?.text ?? "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: {
      posts,
    },
  };
};
