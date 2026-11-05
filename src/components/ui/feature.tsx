import { useEffect, useRef, useState, type ComponentType, type RefObject } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  CalendarCheck,
  Check,
  Inbox,
  Lock,
  Mail,
  MessageCircle,
  MousePointer2,
  Pencil,
  ShoppingBag,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { useStill } from '../../hooks/useA11yPrefs';
import { LANGS, NATIVE_NAME, isRtl, type Lang } from '../../i18n/languages';

/* ── Feature cards ───────────────────────────────────────────────
 * A card shows a small scene from the product instead of a picture. A
 * scene is a plain function of `step`: `beats` say how long each step
 * holds, the card walks them once when it comes into view, and the scene
 * rests on its last step (LT-433: decorative motion runs once). That last
 * step is also what a visitor who asked for less motion sees. Hovering or
 * tapping a card that has finished plays it again.
 *
 * Adapted for lightor.app (LT-526) from the 21st.dev component: no shadcn
 * tokens, the card's own type stays Assistant, and its three endless
 * intervals (type, layout, speed) became the languages, site and address
 * scenes. LT-582: the cards fit every kind of site - the site itself first,
 * then products, inquiries and bookings side by side. Everything inside a scene is decoration (aria-hidden): the card's
 * heading and text say the same thing in words.
 * ─────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const SOFT = { duration: 0.5, ease: EASE };

const appear = (on: boolean) => ({ opacity: on ? 1 : 0, y: on ? 0 : 10, scale: on ? 1 : 0.92 });

const PANEL = 'rounded-2xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10';

export interface FeatureScene {
  Scene: ComponentType<{ step: number }>;
  beats: readonly number[];
}

const useStory = (ref: RefObject<HTMLElement>, beats: readonly number[], delay: number) => {
  const still = useStill();
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [step, setStep] = useState(0);
  const [take, setTake] = useState(0);
  const last = beats.length;

  useEffect(() => {
    if (!inView || still) return;
    setStep(0);
    let at = take ? 0 : delay;
    const timers = beats.map((beat, i) => {
      at += beat;
      return setTimeout(() => setStep(i + 1), at);
    });
    return () => timers.forEach(clearTimeout);
  }, [inView, still, take, beats, delay]);

  const replay = () => {
    if (!still && step === last) setTake((n) => n + 1);
  };

  return { step: still ? last : step, replay };
};

/** The text grows letter by letter while `on`; all of it at once for a still page. */
const useTyped = (text: string, on: boolean, ms = 45) => {
  const still = useStill();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!on) {
      setShown(0);
      return;
    }
    if (still || shown >= text.length) return;
    const timer = setTimeout(() => setShown(shown + 1), ms);
    return () => clearTimeout(timer);
  }, [on, still, shown, text, ms]);

  return still ? text : text.slice(0, shown);
};

interface FeatureCardProps {
  scene: FeatureScene;
  title: string;
  text: string;
  /** Spans two columns from lg up, with the scene beside the words. */
  wide?: boolean;
  /** The brand gradient block. */
  lead?: boolean;
  /** Cards that enter together start a little apart. */
  delay?: number;
  className?: string;
}

export const FeatureCard = ({ scene, title, text, wide, lead, delay = 0, className = '' }: FeatureCardProps) => {
  const ref = useRef<HTMLElement>(null);
  const { step, replay } = useStory(ref, scene.beats, delay);
  const { Scene } = scene;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.45, delay: delay / 1000 } }}
      whileHover={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      viewport={{ once: true, margin: '-40px' }}
      onHoverStart={replay}
      onClick={replay}
      className={`flex flex-col overflow-hidden rounded-3xl ${wide ? 'lg:flex-row' : ''} ${
        lead
          ? 'bg-gradient-to-br from-violet-600 to-pink-600 text-white'
          : 'border border-gray-200 bg-white dark:border-gray-800 dark:bg-black'
      } ${className}`}
    >
      <div
        aria-hidden="true"
        className={`relative h-52 shrink-0 overflow-hidden sm:h-60 ${wide ? 'lg:order-last lg:h-auto lg:min-h-[20rem] lg:w-[62%]' : ''} ${
          lead ? '' : 'bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950/40 dark:to-pink-950/20'
        }`}
      >
        <Scene step={step} />
      </div>
      <div className={`p-6 ${wide ? 'lg:flex-1 lg:self-center lg:p-9' : ''}`}>
        <h3 className={`font-bold ${wide ? 'text-2xl sm:text-3xl' : 'text-xl'} ${lead ? '' : 'text-gray-950 dark:text-white'}`}>{title}</h3>
        <p className={`mt-2 ${lead ? 'text-lg text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>{text}</p>
      </div>
    </motion.article>
  );
};

/* ── The calendar: bookings land, one is dragged to another day ───── */

const COLS = 5;
const ROWS = 4;
const CELL = { width: `${100 / COLS}%`, height: `${100 / ROWS}%` };

const TINTS = {
  violet: 'border-s-[3px] border-violet-500 bg-violet-100 text-violet-900 dark:bg-violet-900/60 dark:text-violet-100',
  pink: 'border-s-[3px] border-pink-500 bg-pink-100 text-pink-900 dark:bg-pink-900/50 dark:text-pink-100',
};

const BOOKINGS = [
  { col: 0, row: 0, tint: TINTS.violet },
  { col: 1, row: 2, tint: TINTS.pink },
  { col: 2, row: 0, tint: TINTS.pink },
  { col: 4, row: 1, tint: TINTS.violet },
];

const DRAGGED = { from: { col: 3, row: 3 }, to: { col: 2, row: 1 } };
const STEP = { cursor: 6, lift: 7, move: 8, drop: 9 };
const GLIDE = { duration: 0.6, ease: [0.65, 0, 0.35, 1] };

/** A cell's place: a percentage of the cell itself, so it needs no measuring, and mirrored for RTL. */
const cell = ({ col, row }: { col: number; row: number }, rtl: boolean) => ({
  x: `${(rtl ? -col : col) * 100}%`,
  y: `${row * 100}%`,
});

// The working week: Sunday to Thursday in Hebrew and Arabic. Written out, not
// Intl: the page is drawn on the build machine (LT-579), whose dates can read
// differently from a browser's, and the two must match.
const WEEKDAYS: Record<Lang, string[]> = {
  he: ['יום א׳', 'יום ב׳', 'יום ג׳', 'יום ד׳', 'יום ה׳'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
  fr: ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.'],
  es: ['lun', 'mar', 'mié', 'jue', 'vie'],
};

const weekdays = (lang: string) => WEEKDAYS[lang as Lang] ?? WEEKDAYS.he;

const CalendarScene = ({ step }: { step: number }) => {
  const { t, i18n } = useTranslation();
  const rtl = isRtl(i18n.language);
  const names = t('features.demo.names', { returnObjects: true }) as string[];
  const moved = step >= STEP.move ? DRAGGED.to : DRAGGED.from;
  const lifted = step === STEP.lift || step === STEP.move;

  return (
    <div className="flex h-full flex-col p-3 sm:p-4">
      <div className="flex">
        <div className="hidden w-12 sm:block" />
        <div className="grid flex-1 grid-cols-5 pb-1.5 text-center text-xs font-bold text-gray-500 dark:text-gray-400">
          {weekdays(i18n.language).map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="hidden w-12 flex-col text-xs text-gray-500 sm:flex dark:text-gray-400">
          {['09:00', '10:00', '11:00', '12:00'].map((hour) => (
            <span key={hour} className="flex-1 pt-1">
              {hour}
            </span>
          ))}
        </div>
        <div className={`relative flex-1 ${PANEL}`}>
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-4">
            {Array.from({ length: COLS * ROWS }, (_, i) => (
              <span key={i} className="border-b border-e border-gray-100 last:border-0 dark:border-gray-800" />
            ))}
          </div>

          {BOOKINGS.map(({ col, row, tint }, i) => (
            <motion.div
              key={i}
              className="absolute start-0 top-0 p-0.5"
              style={CELL}
              initial={false}
              animate={{ ...cell({ col, row }, rtl), opacity: step > i ? 1 : 0, scale: step > i ? 1 : 0.8 }}
              transition={SOFT}
            >
              <span className={`flex h-full items-center truncate rounded-lg px-1.5 text-xs font-semibold ${tint}`}>{names[i]}</span>
            </motion.div>
          ))}

          <motion.div
            className="absolute start-0 top-0 z-10 p-0.5"
            style={CELL}
            initial={false}
            animate={{ ...cell(moved, rtl), opacity: step >= 5 ? 1 : 0, scale: lifted ? 1.1 : step >= 5 ? 1 : 0.8, rotate: lifted ? -3 : 0 }}
            transition={step >= STEP.move ? GLIDE : SOFT}
          >
            <span
              className={`flex h-full items-center truncate rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 px-1.5 text-xs font-semibold text-white ${
                lifted ? 'shadow-lg shadow-violet-900/30' : ''
              }`}
            >
              {names[4]}
            </span>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute start-0 top-0 z-20"
            style={CELL}
            initial={false}
            animate={{ ...cell(moved, rtl), opacity: step >= STEP.cursor && step < STEP.drop ? 1 : 0 }}
            transition={step >= STEP.move ? GLIDE : SOFT}
          >
            <MousePointer2 className="absolute end-1 bottom-0 h-6 w-6 fill-gray-950 text-white drop-shadow" />
          </motion.div>

          <motion.p
            className="absolute inset-x-0 bottom-2 z-20 mx-auto flex w-max items-center gap-1.5 rounded-full bg-gray-950 px-3.5 py-1.5 text-sm font-semibold text-white shadow-lg dark:bg-white dark:text-gray-950"
            initial={false}
            animate={appear(step >= STEP.drop)}
            transition={SOFT}
          >
            <Check className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
            {t('features.demo.moved')}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export const calendarScene: FeatureScene = {
  Scene: CalendarScene,
  beats: [250, 220, 220, 220, 220, 450, 300, 450, 700],
};

/* ── Alerts: an inquiry, one about a product, a booking, each on its channel ── */

// Channels as the product allows them (blog/FACTS.md): a new booking never
// goes by phone; inquiries may.
const ALERTS = [
  { id: 'lead', Icon: Inbox, Channel: Mail },
  { id: 'productLead', Icon: ShoppingBag, Channel: MessageCircle },
  { id: 'booking', Icon: CalendarCheck, Channel: Smartphone },
];

const AlertsScene = ({ step }: { step: number }) => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex h-full max-w-sm flex-col justify-center gap-2 p-3 sm:gap-2.5 sm:p-4">
      {ALERTS.map(({ id, Icon, Channel }, i) => (
        <motion.div
          key={id}
          className={`flex items-center gap-3 p-2 sm:p-2.5 ${PANEL}`}
          initial={false}
          animate={{ opacity: step > i ? 1 : 0, y: step > i ? 0 : -14 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
            <Icon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-bold text-gray-950 dark:text-white">{t(`features.demo.alerts.${id}.title`)}</span>
            <span className="block truncate text-xs text-gray-600 dark:text-gray-400">{t(`features.demo.alerts.${id}.text`)}</span>
          </span>
          <Channel className="h-4 w-4 shrink-0 text-pink-600 dark:text-pink-400" />
        </motion.div>
      ))}
    </div>
  );
};

export const alertsScene: FeatureScene = { Scene: AlertsScene, beats: [300, 750, 750] };

/* ── The site: it draws itself, a title is rewritten, a new colour ── */

const ACCENTS = [
  { solid: '#7c3aed', soft: 'rgba(124, 58, 237, 0.12)' },
  { solid: '#db2777', soft: 'rgba(219, 39, 119, 0.12)' },
  { solid: '#059669', soft: 'rgba(5, 150, 105, 0.12)' },
  { solid: '#d97706', soft: 'rgba(217, 119, 6, 0.12)' },
];
const SITE = { nav: 1, hero: 2, gallery: 3, point: 4, edit: 5, swatch: 6 };

const SiteScene = ({ step }: { step: number }) => {
  const { t } = useTranslation();
  const editing = step >= SITE.edit;
  const headline = useTyped(t('features.demo.siteHeadline'), editing, 50);
  const accent = ACCENTS[step >= SITE.swatch ? 1 : 0];

  return (
    <div className="flex h-full items-center justify-center p-4 sm:p-6">
      <div className={`relative h-full w-full max-w-lg overflow-hidden ${PANEL}`}>
        <motion.div
          className="absolute inset-x-0 top-0 flex h-[16%] items-center gap-2 border-b border-gray-100 px-3 dark:border-gray-800"
          initial={false}
          animate={appear(step >= SITE.nav)}
          transition={SOFT}
        >
          <motion.span className="h-3 w-3 shrink-0 rounded-full" initial={false} animate={{ backgroundColor: accent.solid }} transition={SOFT} />
          <span className="truncate text-xs font-bold text-gray-950 dark:text-white">{t('features.demo.business')}</span>
          <span className="ms-auto flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
            ))}
          </span>
        </motion.div>

        <motion.div
          className="absolute inset-x-[4%] top-[21%] flex h-[40%] flex-col justify-center gap-2 rounded-xl px-[5%]"
          initial={false}
          animate={{ ...appear(step >= SITE.hero), backgroundColor: accent.soft }}
          transition={SOFT}
        >
          <span className="relative w-fit max-w-full">
            <motion.span
              className={`block rounded-md px-1 text-base font-extrabold leading-tight sm:text-xl ${
                editing && step < SITE.swatch ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''
              }`}
              style={{ ['--tw-ring-color' as string]: accent.solid }}
              initial={false}
              animate={{ color: accent.solid }}
              transition={SOFT}
            >
              {editing ? headline || ' ' : t('features.demo.business')}
            </motion.span>
            <motion.span
              className="absolute -top-3 -end-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-950 text-white shadow dark:bg-white dark:text-gray-950"
              initial={false}
              animate={appear(step === SITE.point || step === SITE.edit)}
              transition={SOFT}
            >
              <Pencil className="h-3 w-3" />
            </motion.span>
          </span>
          <span className="h-1.5 w-1/2 rounded-full bg-gray-300/80 dark:bg-gray-600" />
          <motion.span className="h-5 w-20 rounded-full" initial={false} animate={{ backgroundColor: accent.solid }} transition={SOFT} />
        </motion.div>

        <div className="absolute inset-x-[4%] top-[65%] grid h-[20%] grid-cols-3 gap-[3%]">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="rounded-lg"
              initial={false}
              animate={{ ...appear(step >= SITE.gallery), backgroundColor: accent.soft }}
              transition={{ ...SOFT, delay: step >= SITE.gallery && step < SITE.point ? i * 0.08 : 0 }}
            />
          ))}
        </div>

        <motion.div className="absolute bottom-[4%] end-[4%] flex gap-1.5" initial={false} animate={appear(step >= SITE.gallery)} transition={SOFT}>
          {ACCENTS.map(({ solid }, i) => (
            <motion.span
              key={solid}
              className="h-3.5 w-3.5 rounded-full"
              style={{ backgroundColor: solid }}
              initial={false}
              animate={{
                scale: i === (step >= SITE.swatch ? 1 : 0) ? 1.3 : 1,
                boxShadow: i === (step >= SITE.swatch ? 1 : 0) ? `0 0 0 2px #fff, 0 0 0 3.5px ${solid}` : `0 0 0 0 #fff, 0 0 0 0 ${solid}`,
              }}
              transition={SOFT}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export const siteScene: FeatureScene = { Scene: SiteScene, beats: [300, 350, 400, 550, 450, 1200] };

/* ── Products: a few words, and Lighty makes the product with its picture ── */

/** Three pieces of the demo studio's ceramics, drawn: no photo to license or load. */
const ART = {
  bowl: (
    <svg viewBox="0 0 40 40" className="h-3/5 w-3/5" aria-hidden="true">
      <ellipse cx="20" cy="17" rx="14" ry="3.5" fill="#1e3a8a" />
      <path d="M6 17 Q20 40 34 17 Z" fill="#3b82f6" />
      <path d="M10 21 Q20 31 30 21" stroke="#bfdbfe" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  cup: (
    <svg viewBox="0 0 40 40" className="h-3/5 w-3/5" aria-hidden="true">
      <rect x="9" y="13" width="18" height="17" rx="4" fill="#f59e0b" />
      <path d="M27 17 h3 a4 4 0 0 1 0 8 h-3" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
      <ellipse cx="18" cy="13" rx="9" ry="2" fill="#b45309" />
    </svg>
  ),
  plate: (
    <svg viewBox="0 0 40 40" className="h-3/5 w-3/5" aria-hidden="true">
      <ellipse cx="20" cy="22" rx="16" ry="7" fill="#fb7185" />
      <ellipse cx="20" cy="21" rx="10" ry="4" fill="#fecdd3" />
    </svg>
  ),
};

const ProductCard = ({ art, tint, name, price, shown, ready }: { art: keyof typeof ART; tint: string; name: string; price: string; shown: boolean; ready: boolean }) => (
  <motion.div className={`p-1.5 ${PANEL}`} initial={false} animate={appear(shown)} transition={SOFT}>
    <span className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-lg ${ready ? tint : 'bg-violet-100 dark:bg-violet-900/40'}`}>
      {ready ? ART[art] : <Sparkles className="h-5 w-5 animate-pulse text-violet-500" />}
    </span>
    <span className={`mt-1 block truncate text-[11px] font-semibold text-gray-900 transition-opacity duration-300 dark:text-gray-100 ${ready ? '' : 'opacity-0'}`}>{name}</span>
    <span className={`block text-[11px] font-bold text-violet-700 transition-opacity duration-300 dark:text-violet-300 ${ready ? '' : 'opacity-0'}`}>{price}</span>
  </motion.div>
);

const PRODUCT = { input: 1, words: 2, make: 3, made: 4, more: 5 };

const ProductsScene = ({ step }: { step: number }) => {
  const { t } = useTranslation();
  const words = useTyped(t('features.demo.productWords'), step >= PRODUCT.words, 45);
  const more = t('features.demo.products', { returnObjects: true }) as { name: string; price: string }[];

  return (
    <div className="mx-auto flex h-full max-w-sm flex-col justify-center gap-2.5 p-4">
      <motion.div className={`flex items-center gap-2 py-1.5 pe-1.5 ps-3 ${PANEL}`} initial={false} animate={appear(step >= PRODUCT.input)} transition={SOFT}>
        <span className={`min-w-0 flex-1 truncate text-sm ${words ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
          {words || t('features.demo.productHint')}
        </span>
        <motion.span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-600 text-white"
          initial={false}
          animate={{ scale: step === PRODUCT.make ? 0.85 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        >
          <Sparkles className="h-3.5 w-3.5" />
        </motion.span>
      </motion.div>
      <div className="grid grid-cols-3 gap-2">
        <ProductCard art="bowl" tint="bg-sky-100" name={t('features.demo.productName')} price={t('features.demo.productPrice')} shown={step >= PRODUCT.make} ready={step >= PRODUCT.made} />
        <ProductCard art="cup" tint="bg-amber-50" name={more[0]?.name ?? ''} price={more[0]?.price ?? ''} shown={step >= PRODUCT.more} ready />
        <ProductCard art="plate" tint="bg-rose-50" name={more[1]?.name ?? ''} price={more[1]?.price ?? ''} shown={step >= PRODUCT.more} ready />
      </div>
    </div>
  );
};

export const productsScene: FeatureScene = { Scene: ProductsScene, beats: [250, 1150, 450, 750, 450] };

/* ── Leads: the site's form is sent, and the inquiry lands with its status ── */

const LEAD = { form: 1, name: 2, message: 3, sent: 4, contacted: 5 };

const FIELD = 'block h-6 truncate rounded-lg bg-gray-50 px-2 text-[11px] leading-6 dark:bg-gray-800';

const LeadsScene = ({ step }: { step: number }) => {
  const { t } = useTranslation();
  const name = useTyped(t('features.demo.leadName'), step >= LEAD.name, 55);
  const message = useTyped(t('features.demo.leadMessage'), step >= LEAD.message, 30);
  const sent = step >= LEAD.sent;
  const contacted = step >= LEAD.contacted;
  const older = t('features.demo.olderLead', { returnObjects: true }) as { name: string; text: string };

  const row = (who: string, what: string, status: string, tone: string) => (
    <>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
        {who.charAt(0)}
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-xs font-bold text-gray-950 dark:text-white">{who}</span>
        <span className="block truncate text-[11px] text-gray-600 dark:text-gray-400">{what}</span>
      </span>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors duration-300 ${tone}`}>{status}</span>
    </>
  );

  return (
    <div className="mx-auto flex h-full max-w-sm flex-col justify-center gap-2 p-4">
      <motion.div className={`space-y-1.5 p-2 ${PANEL}`} initial={false} animate={appear(step >= LEAD.form)} transition={SOFT}>
        <span className={`${FIELD} ${name ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>{name || t('features.demo.namePlaceholder')}</span>
        <span className="flex gap-1.5">
          <span className={`${FIELD} min-w-0 flex-1 ${message ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
            {message || t('features.demo.messagePlaceholder')}
          </span>
          <motion.span
            className="flex h-6 shrink-0 items-center gap-1 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 px-2.5 text-[11px] font-bold text-white"
            initial={false}
            animate={{ scale: step === LEAD.sent ? [1, 0.88, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {sent && <Check className="h-3 w-3" />}
            {sent ? t('features.demo.sent') : t('features.demo.send')}
          </motion.span>
        </span>
      </motion.div>
      <motion.div className={`flex items-center gap-2 p-2 ${PANEL}`} initial={false} animate={{ opacity: sent ? 1 : 0, y: sent ? 0 : -10 }} transition={SOFT}>
        {row(
          t('features.demo.leadName'),
          t('features.demo.leadMessage'),
          contacted ? t('features.demo.status.contacted') : t('features.demo.status.new'),
          contacted ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200' : 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200',
        )}
      </motion.div>
      <motion.div className={`flex items-center gap-2 p-2 ${PANEL}`} initial={false} animate={appear(step >= LEAD.form)} transition={SOFT}>
        {row(older.name, older.text, t('features.demo.status.closed'), 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300')}
      </motion.div>
    </div>
  );
};

export const leadsScene: FeatureScene = { Scene: LeadsScene, beats: [250, 700, 1050, 450, 800] };

/* ── Languages: one greeting after another, ending on the visitor's own ── */

const HELLO: Record<Lang, string> = { he: 'שלום', en: 'Hello', ar: 'مرحبا', fr: 'Bonjour', es: 'Hola' };

const LanguagesScene = ({ step }: { step: number }) => {
  const { i18n } = useTranslation();
  const own = i18n.language as Lang;
  const order = [...LANGS.filter((lang) => lang !== own), own];
  const lang = order[step];
  const resting = step === order.length - 1;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-4">
      <div className="flex h-24 items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={lang}
            lang={lang}
            dir="auto"
            className="bg-gradient-to-br from-violet-600 to-pink-600 bg-clip-text p-2 text-6xl font-extrabold text-transparent dark:from-violet-400 dark:to-pink-400"
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: resting ? 1.15 : 1 }}
            exit={{ opacity: 0, y: -14, scale: 1 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {HELLO[lang]}
          </motion.span>
        </AnimatePresence>
      </div>
      <ul className="flex flex-wrap justify-center gap-1.5">
        {LANGS.map((code) => (
          <li
            key={code}
            lang={code}
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors duration-200 ${
              code === lang ? 'bg-violet-700 text-white' : 'bg-white/80 text-gray-700 dark:bg-white/10 dark:text-gray-300'
            }`}
          >
            {NATIVE_NAME[code]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const languagesScene: FeatureScene = { Scene: LanguagesScene, beats: [600, 600, 600, 600] };

/* ── The address: typed in the browser's bar, and the site is live ─── */

const ADDRESS = 'your-business.lightor.app';

const AddressScene = ({ step }: { step: number }) => {
  const { t } = useTranslation();
  const typed = useTyped(ADDRESS, step >= 1, 40);
  const live = step >= 3;

  return (
    <div className="relative flex h-full items-center justify-center p-5 sm:p-8 lg:p-5">
      <div dir="ltr" className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl shadow-violet-950/25">
        <div className="flex h-11 items-center gap-2.5 px-3 font-mono text-[13px] text-gray-900 sm:h-12 sm:px-4 sm:text-base lg:px-3 lg:text-[13px]">
          <Lock className="h-4 w-4 shrink-0 text-emerald-600" />
          <span className="truncate">{typed}</span>
        </div>
        <div className="h-1 bg-violet-100">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 to-pink-600"
            initial={false}
            animate={{ width: step >= 2 ? '100%' : '0%' }}
            transition={{ duration: step >= 2 ? 0.7 : 0.2, ease: 'easeInOut' }}
          />
        </div>
        <motion.div
          className="grid h-24 grid-cols-[1.4fr_1fr] gap-3 p-3 sm:h-36 sm:p-4 lg:h-44"
          initial={false}
          animate={{ opacity: live ? 1 : 0 }}
          transition={SOFT}
        >
          <div className="flex flex-col justify-center gap-2">
            <span className="h-2.5 w-4/5 rounded-full bg-violet-200" />
            <span className="h-2 w-3/5 rounded-full bg-gray-200" />
            <span className="mt-1 h-5 w-20 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 sm:h-6" />
          </div>
          <span className="rounded-xl bg-gradient-to-br from-violet-100 to-pink-100" />
        </motion.div>
      </div>
      <motion.p
        className="absolute inset-x-0 bottom-3 mx-auto flex w-max items-center gap-1.5 rounded-full bg-gray-950 px-3.5 py-1.5 text-sm font-bold text-white shadow-lg sm:bottom-5"
        initial={false}
        animate={appear(live)}
        transition={SOFT}
      >
        <Check className="h-4 w-4 text-emerald-400" />
        {t('features.demo.live')}
      </motion.p>
      <motion.img
        src="/lighty-cheer.webp"
        alt=""
        width={640}
        height={640}
        loading="lazy"
        className="absolute bottom-0 end-1 h-24 w-24 object-contain sm:h-28 sm:w-28"
        initial={false}
        animate={{ opacity: live ? 1 : 0, y: live ? 0 : 24, scale: live ? 1 : 0.8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      />
    </div>
  );
};

export const addressScene: FeatureScene = { Scene: AddressScene, beats: [300, 1150, 800] };
