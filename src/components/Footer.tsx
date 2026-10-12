import { useTranslation } from 'react-i18next';

const LINKS = {
  product: [
    { key: 'how', href: '#how' },
    { key: 'lighty', href: '#lighty' },
    { key: 'features', href: '#features' },
    { key: 'sites', href: 'https://lightor.app/sites' },
  ],
  account: [
    { key: 'start', href: 'https://register.lightor.app' },
    { key: 'signIn', href: 'https://dashboard.lightor.app' },
  ],
  legal: [
    { key: 'pricing', href: 'https://lightor.app/pricing.html' },
    { key: 'support', href: 'https://lightor.app/support.html' },
    { key: 'privacy', href: 'https://lightor.app/privacy.html' },
    { key: 'terms', href: 'https://lightor.app/terms.html' },
    { key: 'refund', href: 'https://lightor.app/refund.html' },
  ],
} as const;

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-white" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#home" className="inline-flex items-center gap-2.5" aria-label="Lightor">
              <img src="/lightor-logo.webp" alt="" width={36} height={36} className="h-9 w-9 rounded-xl" />
              <span className="text-xl font-bold">Lightor</span>
            </a>
            <p className="mt-4 max-w-xs text-gray-400">{t('footer.tagline')}</p>
          </div>
          {(Object.keys(LINKS) as (keyof typeof LINKS)[]).map((group) => (
            <nav key={group} aria-label={t(`footer.${group}`)}>
              <h3 className="font-semibold">{t(`footer.${group}`)}</h3>
              <ul className="mt-4 space-y-2.5">
                {LINKS[group].map(({ key, href }) => (
                  <li key={key}>
                    <a href={href} className="text-gray-400 transition-colors hover:text-white">
                      {t(`footer.links.${key}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-500">{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
