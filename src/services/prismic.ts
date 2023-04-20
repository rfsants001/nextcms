import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import sm from "../../sm.json";

export const repositoryName = prismic.getRepositoryName(sm.apiEndpoint);

const routes = [
  {
    type: "homepage",
    path: "/",
  },
  {
    type: "page",
    path: "/:uid",
  },
];

export const createClient = (
  req?: prismic.HttpRequestLike,
  config = {
    req,
  }
) => {
  const client = prismic.createClient(sm.apiEndpoint, {
    accessToken: process.env.PRISMIC_SECRET ?? "",
    ...config,
  });

  prismicNext.enableAutoPreviews({
    client,
    req: config.req,
  });

  return client;
};
