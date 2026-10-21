import { ArrowLeft } from 'lucide-react';
import SiteShell from '../components/SiteShell';
import { BODY_ATTR, type ArticlePost, type BlogData, type PostCard } from './types';

/**
 * LT-430: the blog, inside the same frame as the home page (navbar, footer,
 * dark mode, accessibility and language menus). Every page is rendered to
 * HTML when the site is built, so a search engine reads the whole article
 * without running a script; the browser then takes the page over.
 *
 * The blog is written in Hebrew only, so its own words live here rather than
 * in the five locales.
 */

const REGISTER_URL = 'https://register.lightor.app';

const Crumbs = ({ current }: { current?: string }) => (
  <nav aria-label="פירורי לחם" className="text-sm text-gray-600 dark:text-gray-400">
    <a href="/" className="hover:text-violet-700 hover:underline dark:hover:text-violet-300">לייטור</a>
    <span aria-hidden="true" className="mx-2">/</span>
    {current ? (
      <a href="/blog/" className="hover:text-violet-700 hover:underline dark:hover:text-violet-300">בלוג</a>
    ) : (
      <span aria-current="page">בלוג</span>
    )}
  </nav>
);

const Card = ({ post }: { post: PostCard }) => (
  <li>
    <a
      href={post.path}
      className="flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-6 transition hover:border-violet-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:border-gray-800 dark:bg-black dark:hover:border-violet-500/50"
    >
      <h3 className="text-balance text-lg font-bold leading-snug text-gray-950 dark:text-white">{post.title}</h3>
      <p className="mt-2 flex-1 text-gray-600 dark:text-gray-400">{post.description}</p>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <time dateTime={post.date}>{post.dateLabel}</time> · {post.minutes} דקות קריאה
      </p>
    </a>
  </li>
);

/** The closing call to action, in the home page's own style. */
const Cta = ({ title, text, as: Heading = 'h2' }: { title?: string; text?: string; as?: 'h2' }) => (
  <aside
    aria-labelledby="blog-cta-title"
    className="relative mt-14 grid items-center gap-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 px-6 py-10 text-white sm:px-10 md:grid-cols-[1fr_auto]"
  >
    <div className="text-center md:text-start">
      <Heading id="blog-cta-title" className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
        {title || 'האתר שלכם, תוך 60 שניות'}
      </Heading>
      <p className="mt-3 text-lg text-white/90">
        {text || 'מספרים ל-Lighty על העסק במילים פשוטות, והוא בונה את האתר - עם קביעת תורים או טופס לידים, תזכורות ללקוחות וכתובת משלכם. ללא אשראי וללא התחייבות.'}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
        <a
          href={REGISTER_URL}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-lg font-bold text-violet-700 shadow-lg transition hover:bg-violet-50 sm:w-auto"
        >
          לבניית האתר שלי - בחינם
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </a>
        <a
          href="/sites"
          className="inline-flex w-full items-center justify-center rounded-full border border-white/50 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10 sm:w-auto"
        >
          לראות אתרים שנבנו
        </a>
      </div>
    </div>
    <img
      src="/lighty-cheer.webp"
      alt=""
      width={800}
      height={800}
      loading="lazy"
      className="mx-auto w-36 drop-shadow-[0_18px_30px_rgba(40,0,80,0.35)] sm:w-48"
    />
  </aside>
);

const Article = ({ post, related, html }: { post: ArticlePost; related: PostCard[]; html: string }) => (
  <>
    <article className="mx-auto max-w-3xl px-4 pb-6 pt-28 sm:px-6 sm:pt-36">
      <Crumbs current={post.title} />
      <h1 className="text-balance mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl sm:leading-tight dark:text-white">
        {post.title}
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        <time dateTime={post.date}>{post.dateLabel}</time>
        {post.updated && (
          <>
            {' · עודכן '}
            <time dateTime={post.updated}>{post.updatedLabel}</time>
          </>
        )}
        {` · ${post.minutes} דקות קריאה`}
      </p>
      {post.headings.length >= 4 && (
        <nav aria-labelledby="toc-title" className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950">
          <h2 id="toc-title" className="font-bold text-gray-950 dark:text-white">בכתבה</h2>
          <ol className="mt-2 list-decimal space-y-1 ps-5 text-gray-700 marker:text-violet-600 dark:text-gray-300">
            {post.headings.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className="hover:text-violet-700 hover:underline dark:hover:text-violet-300">{h.text}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="blog-prose mt-10" {...{ [BODY_ATTR]: '' }} dangerouslySetInnerHTML={{ __html: html }} />
      <Cta title={post.ctaTitle} text={post.ctaText} />
    </article>
    {related.length > 0 && (
      <section aria-labelledby="related-title" className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <h2 id="related-title" className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">עוד בבלוג</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => <Card key={p.slug} post={p} />)}
        </ul>
      </section>
    )}
  </>
);

const Index = ({ posts }: { posts: PostCard[] }) => (
  <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 sm:pt-36 lg:px-8">
    <Crumbs />
    <h1 className="text-balance mt-4 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl dark:text-white">הבלוג של לייטור</h1>
    <p className="mt-4 max-w-3xl text-lg text-gray-600 sm:text-xl dark:text-gray-400">
      מדריכים קצרים ומעשיים לבעלי עסקים קטנים: איך בונים אתר, מקבלים תורים ולידים אונליין, שולחים תזכורות ללקוחות ומופיעים בגוגל.
    </p>
    <section aria-labelledby="list-title" className="mt-12">
      <h2 id="list-title" className="sr-only">כל הכתבות</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <Card key={p.slug} post={p} />)}
      </ul>
    </section>
    <Cta />
  </div>
);

const BlogApp = ({ data, html }: { data: BlogData; html: string }) => (
  <SiteShell home="/" current="blog">
    {data.kind === 'article' ? <Article post={data.post} related={data.related} html={html} /> : <Index posts={data.posts} />}
  </SiteShell>
);

export default BlogApp;
