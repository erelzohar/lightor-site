import { ArrowLeft } from 'lucide-react';
import SiteShell from '../components/SiteShell';
import { BODY_ATTR, type ArticlePost, type BlogData, type BlogImage, type PostCard } from './types';

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

/**
 * The home page's two soft glows (Hero.tsx): radial gradients, never blur
 * filters, never moving. Not clipped to the header, which is shorter than
 * they are: they fade out on their own (the page clips the sides).
 */
const Glows = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute -top-56 start-[30%] h-[38rem] w-[38rem] bg-[radial-gradient(closest-side,rgba(167,139,250,0.32),rgba(167,139,250,0.176)_55%,transparent)] dark:bg-[radial-gradient(closest-side,rgba(109,40,217,0.32),rgba(109,40,217,0.176)_55%,transparent)]" />
    <div className="absolute top-16 -end-48 h-[34rem] w-[34rem] bg-[radial-gradient(closest-side,rgba(249,168,212,0.32),rgba(249,168,212,0.176)_55%,transparent)] dark:bg-[radial-gradient(closest-side,rgba(190,24,93,0.26),rgba(190,24,93,0.143)_55%,transparent)]" />
  </div>
);

const Picture = ({ image, sizes, eager, className }: { image: BlogImage; sizes: string; eager?: boolean; className: string }) => (
  <img
    src={image.src1200}
    srcSet={`${image.src640} 640w, ${image.src1200} 1200w`}
    sizes={sizes}
    width={image.width}
    height={image.height}
    alt={image.alt}
    loading={eager ? 'eager' : 'lazy'}
    decoding="async"
    {...(eager ? { fetchpriority: 'high' } : {})}
    className={className}
  />
);

const Chip = ({ children, guide }: { children: string; guide?: boolean }) => (
  <span
    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
      guide
        ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white'
        : 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
    }`}
  >
    {children}
  </span>
);

/** A guide's chip says so; an article's is its first tag. */
const CardChip = ({ post }: { post: PostCard }) =>
  post.kind === 'guide' ? <Chip guide>מדריך ללייטור</Chip> : post.tag ? <Chip>{post.tag}</Chip> : null;

const Crumbs = ({ inArticle }: { inArticle?: boolean }) => (
  <nav aria-label="פירורי לחם" className="text-sm text-gray-600 dark:text-gray-400">
    <a href="/" className="hover:text-violet-700 hover:underline dark:hover:text-violet-300">לייטור</a>
    <span aria-hidden="true" className="mx-2">/</span>
    {inArticle ? (
      <a href="/blog/" className="hover:text-violet-700 hover:underline dark:hover:text-violet-300">בלוג</a>
    ) : (
      <span aria-current="page">בלוג</span>
    )}
  </nav>
);

const Meta = ({ post }: { post: PostCard }) => (
  <p className="text-sm text-gray-600 dark:text-gray-400">
    <time dateTime={post.date}>{post.dateLabel}</time> · {post.minutes} דקות קריאה
  </p>
);

/**
 * A card with the article's photo on top. `wide` spans the row with the photo
 * beside the text; `large` is one of the two cards at the top of the page.
 */
const Card = ({ post, layout, headingLevel: H = 'h3' }: { post: PostCard; layout?: 'wide' | 'large'; headingLevel?: 'h2' | 'h3' }) => {
  const featured = layout === 'wide';
  const big = layout === 'wide' || layout === 'large';
  return (
  <li className={featured ? 'sm:col-span-2 lg:col-span-3' : undefined}>
    <a
      href={post.path}
      className={`flex h-full overflow-hidden rounded-3xl border border-gray-200 bg-white transition-[border-color,box-shadow] duration-200 hover:border-violet-300 hover:shadow-[0_12px_40px_rgba(76,29,149,0.12)] dark:border-gray-800 dark:bg-black dark:hover:border-violet-500/50 ${
        featured ? 'flex-col md:flex-row' : 'flex-col'
      }`}
    >
      <div className={`bg-gray-100 dark:bg-gray-900 ${featured ? 'md:w-[55%] md:shrink-0' : ''}`}>
        <Picture
          image={post.image}
          sizes={featured ? '(min-width: 768px) 55vw, 100vw' : layout === 'large' ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
          eager={big}
          className={`aspect-[16/9] w-full object-cover ${featured ? 'md:aspect-auto md:h-full md:min-h-[20rem]' : ''}`}
        />
      </div>
      <div className={`flex flex-1 flex-col gap-3 p-6 ${featured ? 'md:justify-center md:p-10' : ''}`}>
        <div><CardChip post={post} /></div>
        <H className={`text-balance font-bold leading-snug text-gray-950 dark:text-white ${big ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>
          {post.title}
        </H>
        <p className={`flex-1 text-gray-600 dark:text-gray-400 ${big ? 'text-lg' : ''}`}>{post.description}</p>
        <Meta post={post} />
      </div>
    </a>
  </li>
  );
};

/** The closing call to action, in the home page's own style. */
const Cta = ({ title, text }: { title?: string; text?: string }) => (
  <aside
    aria-labelledby="blog-cta-title"
    className="relative mt-14 grid items-center gap-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 px-6 py-10 text-white sm:px-10 md:grid-cols-[1fr_auto]"
  >
    <div className="text-center md:text-start">
      <h2 id="blog-cta-title" className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
        {title || 'האתר שלכם, תוך 60 שניות'}
      </h2>
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
    <article>
      <header className="relative isolate pt-28 sm:pt-36">
        <Glows />
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Crumbs inArticle />
          {(post.kind === 'guide' || post.tags.length > 0) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.kind === 'guide' && <Chip guide>מדריך ללייטור</Chip>}
              {post.tags.map((t) => <Chip key={t}>{t}</Chip>)}
            </div>
          )}
          <h1 className="text-balance mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl sm:leading-tight dark:text-white">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 sm:text-xl dark:text-gray-400">{post.description}</p>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={post.date}>{post.dateLabel}</time>
            {post.updated && (
              <>
                {' · עודכן '}
                <time dateTime={post.updated}>{post.updatedLabel}</time>
              </>
            )}
            {` · ${post.minutes} דקות קריאה`}
          </p>
          {post.verified && (
            <p className="mt-2 text-sm font-medium text-violet-700 dark:text-violet-300">
              כל שלב במדריך נבדק במערכת עצמה ב-<time dateTime={post.verified}>{post.verifiedLabel}</time>.
            </p>
          )}
        </div>
        <figure className="mx-auto mt-8 max-w-5xl px-4 sm:mt-10 sm:px-6">
          <Picture
            image={post.image}
            sizes="(min-width: 1024px) 1024px, 100vw"
            eager
            className="aspect-[16/9] w-full rounded-3xl bg-gray-100 object-cover shadow-[0_24px_60px_rgba(76,29,149,0.16)] dark:bg-gray-900"
          />
          <figcaption className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            צילום: <bdi>{post.credit}</bdi>
          </figcaption>
        </figure>
      </header>
      <div className="mx-auto max-w-3xl px-4 pb-6 sm:px-6">
        {post.headings.length >= 4 && (
          <nav aria-labelledby="toc-title" className="mt-10 rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-950">
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
      </div>
    </article>
    {related.length > 0 && (
      <section aria-labelledby="related-title" className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <h2 id="related-title" className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">עוד בבלוג</h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => <Card key={p.slug} post={p} />)}
        </ul>
      </section>
    )}
  </>
);

/**
 * The top of the blog's page: up to two pinned posts (`featured: true`), or
 * else the newest guide and the newest article, so one niche article never
 * stands there alone.
 */
const topOf = (posts: PostCard[]): PostCard[] => {
  const pinned = posts.filter((p) => p.featured).slice(0, 2);
  if (pinned.length) return pinned;
  return [posts.find((p) => p.kind === 'guide'), posts.find((p) => p.kind !== 'guide')].filter((p): p is PostCard => !!p);
};

const Index = ({ posts }: { posts: PostCard[] }) => {
  const top = topOf(posts);
  const rest = posts.filter((p) => !top.includes(p));
  const guides = rest.filter((p) => p.kind === 'guide');
  const articles = rest.filter((p) => p.kind !== 'guide');
  const jump = 'inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 font-semibold text-gray-800 transition-colors hover:border-violet-300 hover:text-violet-700 dark:border-gray-800 dark:bg-black/40 dark:text-gray-200 dark:hover:text-violet-300';
  return (
    <>
      <section className="relative isolate pt-28 sm:pt-36" aria-labelledby="blog-title">
        <Glows />
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <Crumbs />
            <h1 id="blog-title" className="text-balance mt-6 text-4xl font-bold tracking-tight text-gray-950 sm:text-6xl dark:text-white">
              <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">בלוג</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-400">
              מדריכים קצרים ומעשיים: איך בונים אתר, מקבלים תורים ולידים אונליין, שולחים תזכורות ללקוחות ומופיעים בגוגל.
            </p>
            <nav aria-label="בבלוג" className="mt-6 flex flex-wrap gap-3">
              <a href="#guides" className={jump}>מדריכים ללייטור <span className="text-violet-600 dark:text-violet-400">{posts.filter((p) => p.kind === 'guide').length}</span></a>
              <a href="#articles" className={jump}>כתבות <span className="text-violet-600 dark:text-violet-400">{posts.filter((p) => p.kind !== 'guide').length}</span></a>
            </nav>
          </div>
          <img
            src="/lighty-growth.webp"
            alt=""
            width={640}
            height={640}
            className="hidden w-52 drop-shadow-[0_18px_30px_rgba(76,29,149,0.25)] md:block lg:w-64"
          />
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section aria-label="מומלץ">
          <ul className={`grid gap-5 ${top.length > 1 ? 'lg:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {top.map((p) => <Card key={p.slug} post={p} layout={top.length > 1 ? 'large' : 'wide'} headingLevel="h2" />)}
          </ul>
        </section>
        {guides.length > 0 && (
          <section id="guides" aria-labelledby="guides-title" className="mt-14">
            <h2 id="guides-title" className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">מדריכים ללייטור</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">צעד אחר צעד, עם צילומי מסך מהמערכת עצמה.</p>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((p) => <Card key={p.slug} post={p} />)}
            </ul>
          </section>
        )}
        {articles.length > 0 && (
          <section id="articles" aria-labelledby="articles-title" className="mt-14">
            <h2 id="articles-title" className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">כתבות</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((p) => <Card key={p.slug} post={p} />)}
            </ul>
          </section>
        )}
        <Cta />
      </div>
    </>
  );
};

const BlogApp = ({ data, html }: { data: BlogData; html: string }) => (
  <SiteShell home="/" current="blog">
    {data.kind === 'article' ? <Article post={data.post} related={data.related} html={html} /> : <Index posts={data.posts} />}
  </SiteShell>
);

export default BlogApp;
