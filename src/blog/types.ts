/**
 * LT-430: what scripts/blog/build.mjs hands a blog page. It is rendered on
 * the build machine (entry-server) and embedded in the page as JSON, so the
 * browser (entry-client) takes over the same page without fetching anything.
 * Dates arrive already written out in Hebrew, so the server and the browser
 * print the same text.
 */
export interface PostCard {
  slug: string;
  path: string;
  title: string;
  description: string;
  date: string;
  dateLabel: string;
  minutes: number;
}

export interface ArticlePost extends PostCard {
  updated?: string;
  updatedLabel?: string;
  headings: { id: string; text: string }[];
  ctaTitle?: string;
  ctaText?: string;
}

export type BlogData =
  | { kind: 'article'; post: ArticlePost; related: PostCard[] }
  | { kind: 'index'; posts: PostCard[] };

/** The element that holds an article's text, read back by the browser before it takes over. */
export const BODY_ATTR = 'data-blog-body';
export const DATA_ID = 'lt-blog-data';
