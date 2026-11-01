import { useEffect, useRef, useState, type ComponentType, type RefObject } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  CalendarCheck,
  Check,
  CheckCheck,
  Inbox,
  Lock,
  Mail,
  MessageCircle,
  MousePointer2,
  Smartphone,
  Sunrise,
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
 * intervals (type, layout, speed) became the languages, design and address
 * scenes. Everything inside a scene is decoration (aria-hidden): the card's
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

const weekdays = (lang: string) => {
  // 1 Nov 2026 is a Sunday: the working week starts there in Hebrew and Arabic.
  const first = isRtl(lang) ? 1 : 2;
  const format = new Intl.DateTimeFormat(lang, { weekday: 'short' });
  return Array.from({ length: COLS }, (_, i) => format.format(new Date(2026, 10, first + i)));
};

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

/* ── Reminders: the customer's two messages ───────────────────────── */

const BUBBLE = 'w-fit rounded-2xl rounded-ss-md px-3.5 py-2 text-sm shadow-sm';

const RemindersScene = ({ step }: { step: number }) => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex h-full max-w-sm flex-col justify-center gap-2.5 p-4">
      <motion.div className="flex items-center gap-2.5" initial={false} animate={appear(step >= 1)} transition={SOFT}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-600 text-white">
          <CalendarCheck className="h-5 w-5" />
        </span>
        <span className="min-w-0 truncate font-bold text-gray-950 dark:text-white">{t('features.demo.business')}</span>
        <span dir="ltr" className="ms-auto shrink-0 whitespace-nowrap text-xs font-semibold text-violet-700 dark:text-violet-300">
          SMS / WhatsApp
        </span>
      </motion.div>

      <motion.p
        className={`${BUBBLE} bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100`}
        initial={false}
        animate={appear(step >= 2)}
        transition={SOFT}
      >
        {t('features.demo.confirmed')}
      </motion.p>

      <div className="relative">
        {step === 3 && (
          <div className={`${BUBBLE} absolute start-0 top-0 flex gap-1 bg-white dark:bg-gray-800`}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-violet-400"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: 1, delay: i * 0.1 }}
              />
            ))}
          </div>
        )}
        <motion.p
          className={`${BUBBLE} flex items-end gap-2 bg-gradient-to-br from-violet-600 to-pink-600 text-white`}
          initial={false}
          animate={appear(step >= 4)}
          transition={SOFT}
        >
          {t('features.demo.reminder')}
          <CheckCheck className={`h-4 w-4 shrink-0 transition-opacity duration-300 ${step >= 5 ? 'opacity-100' : 'opacity-0'}`} />
        </motion.p>
      </div>
    </div>
  );
};

export const remindersScene: FeatureScene = { Scene: RemindersScene, beats: [250, 350, 650, 750, 450] };

/* ── Alerts: three kinds of news, each on the channel the owner chose ── */

const ALERTS = [
  { id: 'booking', Icon: CalendarCheck, Channel: Smartphone },
  { id: 'lead', Icon: Inbox, Channel: Mail },
  { id: 'summary', Icon: Sunrise, Channel: MessageCircle },
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

/* ── Customers: the visits count up, then a private note ──────────── */

const VISITS = 6;

const CustomersScene = ({ step }: { step: number }) => {
  const { t } = useTranslation();
  const name = t('features.demo.customer');
  const note = t('features.demo.note');
  const typed = useTyped(note, step > VISITS);

  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className={`w-full max-w-sm p-4 ${PANEL}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-600 text-lg font-bold text-white">
            {name.charAt(0)}
          </span>
          <span className="min-w-0 flex-1 truncate font-bold text-gray-950 dark:text-white">{name}</span>
          <span className="text-center leading-none">
            <span className="block text-2xl font-extrabold text-violet-700 tabular-nums dark:text-violet-300">{Math.min(step, VISITS)}</span>
            <span className="mt-1 block text-xs text-gray-600 dark:text-gray-400">{t('features.demo.visits')}</span>
          </span>
        </div>
        <div className="mt-3 rounded-xl bg-violet-50 p-3 dark:bg-violet-900/30">
          <p className="text-xs font-bold text-violet-700 dark:text-violet-300">{t('features.demo.noteLabel')}</p>
          <p className="mt-0.5 min-h-[1.5rem] text-sm text-gray-800 dark:text-gray-100">
            {typed}
            {step > VISITS && typed.length < note.length && <span className="ms-px inline-block h-4 w-px bg-violet-600 align-middle" />}
          </p>
        </div>
      </div>
    </div>
  );
};

export const customersScene: FeatureScene = { Scene: CustomersScene, beats: [300, 130, 130, 130, 130, 130, 350] };

/* ── Design: the blocks rearrange, the colour follows the swatch ──── */

// left, top, width, height in %
const LAYOUTS = [
  [[0, 0, 100, 48], [0, 54, 47, 46], [53, 54, 47, 46]],
  [[0, 0, 30, 100], [35, 0, 30, 100], [70, 0, 30, 100]],
  [[0, 0, 100, 30], [0, 35, 100, 30], [0, 70, 100, 30]],
];
const SWATCHES = ['#7c3aed', '#db2777', '#059669', '#d97706'];
const LOOKS = [
  { layout: 1, swatch: 3 },
  { layout: 2, swatch: 2 },
  { layout: 0, swatch: 1 },
  { layout: 0, swatch: 0 },
];

const DesignScene = ({ step }: { step: number }) => {
  const { layout, swatch } = LOOKS[step];

  return (
    <div dir="ltr" className="mx-auto flex h-full max-w-sm flex-col p-4">
      <div className={`flex min-h-0 flex-1 flex-col ${PANEL}`}>
        <div className="flex gap-1.5 px-3 pt-2.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
        <div className="relative m-3 flex-1">
          {LAYOUTS[layout].map(([left, top, width, height], i) => (
            <motion.div
              key={i}
              className="absolute overflow-hidden rounded-lg"
              style={{ opacity: 1 - i * 0.3 }}
              initial={false}
              animate={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`, backgroundColor: SWATCHES[swatch] }}
              transition={SOFT}
            >
              {i === 0 && (
                <>
                  <span className="absolute inset-x-[14%] top-[28%] h-1.5 rounded-full bg-white/85" />
                  <span className="absolute inset-x-[24%] top-[46%] h-1.5 rounded-full bg-white/60" />
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex justify-center gap-3">
        {SWATCHES.map((color, i) => (
          <motion.span
            key={color}
            className="h-5 w-5 rounded-full"
            style={{ backgroundColor: color }}
            initial={false}
            animate={{ scale: i === swatch ? 1.3 : 1, boxShadow: i === swatch ? `0 0 0 2px #fff, 0 0 0 4px ${color}` : `0 0 0 0 #fff, 0 0 0 0 ${color}` }}
            transition={SOFT}
          />
        ))}
      </div>
    </div>
  );
};

export const designScene: FeatureScene = { Scene: DesignScene, beats: [850, 850, 850] };

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
    <div className="relative flex h-full items-center justify-center p-5 sm:p-8">
      <div dir="ltr" className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl shadow-violet-950/25">
        <div className="flex h-11 items-center gap-2.5 px-4 font-mono text-sm text-gray-900 sm:h-12 sm:text-base">
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
        className="absolute bottom-0 end-1 h-24 w-24 object-contain sm:h-32 sm:w-32 lg:end-3 lg:h-40 lg:w-40"
        initial={false}
        animate={{ opacity: live ? 1 : 0, y: live ? 0 : 24, scale: live ? 1 : 0.8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      />
    </div>
  );
};

export const addressScene: FeatureScene = { Scene: AddressScene, beats: [300, 1150, 800] };
