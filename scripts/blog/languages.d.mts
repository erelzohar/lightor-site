/**
 * LT-715: the one export of scripts/blog/languages.mjs that TypeScript code
 * reads (vite.config.ts). The rest is used by the blog's Node scripts only.
 */
/** The languages ("he", "en", "ar") whose blog has at least three published posts. */
export declare const linkedBlogLanguages: () => string[];
