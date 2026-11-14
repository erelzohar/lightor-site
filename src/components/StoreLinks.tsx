import { useTranslation } from 'react-i18next';
import { FaApple, FaGooglePlay } from 'react-icons/fa6';

/** LT-656: Lightor's apps in the stores (the addresses Erel gave; the FAQ's answer links the same). */
export const APP_STORE_URL = 'https://apps.apple.com/il/app/lightor/id6819305092';
export const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=app.lightor.dashboard';

const STORES = [
  { key: 'appStore', name: 'App Store', href: APP_STORE_URL, Icon: FaApple },
  { key: 'googlePlay', name: 'Google Play', href: GOOGLE_PLAY_URL, Icon: FaGooglePlay },
] as const;

/**
 * LT-656: the two store buttons, in the site's own look (Apple's badge
 * service is gone, and nothing on the page loads from outside it): the
 * store's mark, a small line and the store's name, as the stores' own
 * badges read. `tone` is the surface they sit on.
 */
const StoreLinks = ({ tone = 'dark', className = '' }: { tone?: 'dark' | 'light'; className?: string }) => {
  const { t } = useTranslation();
  const look = tone === 'dark'
    ? 'border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 focus-visible:outline-white'
    : 'border-white/60 bg-black/80 text-white hover:bg-black focus-visible:outline-white';
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`} aria-label={t('stores.label')}>
      {STORES.map(({ key, name, href, Icon }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-w-[10.5rem] items-center gap-3 rounded-xl border px-4 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${look}`}
          >
            <Icon aria-hidden="true" className="h-7 w-7 shrink-0" />
            <span className="flex flex-col text-start leading-tight">
              <span className="text-xs opacity-80">{t(`stores.${key}`)}</span>
              <span className="text-lg font-semibold" dir="ltr">{name}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default StoreLinks;
