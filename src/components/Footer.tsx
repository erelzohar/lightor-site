import { useTranslation } from 'react-i18next';
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa6';

/** LT-652: Lightor's own profiles; the same list as the Organization's sameAs in index.html and the blog's. */
export const PROFILES = [
  { name: 'Instagram', href: 'https://www.instagram.com/lightor.ai/', Icon: FaInstagram },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61590494095586', Icon: FaFacebook },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/lightor/', Icon: FaLinkedin },
  { name: 'TikTok', href: 'https://www.tiktok.com/@lightor.ai', Icon: FaTiktok },
] as const;

const LINKS = {
  product: [
    { key: 'how', href: '#how' },
    { key: 'lighty', href: '#lighty' },
    { key: 'features', href: '#features' },
    { key: 'faq', href: '#faq' },
    { key: 'sites', href: 'https://lightor.app/sites' },
    { key: 'blog', href: 'https://lightor.app/blog/' },
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
    { key: 'accessibility', href: 'https://lightor.app/accessibility.html' },
  ],
} as const;

/** LT-430: `home` is "" on the home page and "/" elsewhere, before its section anchors. */
const Footer = ({ home = '' }: { home?: string }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-white" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href={`${home}#home`} className="inline-flex items-center gap-2.5" aria-label="Lightor">
              <img src="/lightor-logo.webp" alt="" width={36} height={36} className="h-9 w-9 rounded-xl" />
              <span className="text-xl font-bold">Lightor</span>
            </a>
            <p className="mt-4 max-w-xs text-gray-400">{t('footer.tagline')}</p>
            <ul className="mt-5 flex gap-3" aria-label={t('footer.profiles')}>
              {PROFILES.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="me noopener noreferrer"
                    aria-label={t('footer.profile', { network: name })}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-300 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {(Object.keys(LINKS) as (keyof typeof LINKS)[]).map((group) => (
            <nav key={group} aria-label={t(`footer.${group}`)}>
              <h3 className="font-semibold">{t(`footer.${group}`)}</h3>
              <ul className="mt-4 space-y-2.5">
                {LINKS[group].map(({ key, href }) => (
                  <li key={key}>
                    <a href={href.startsWith('#') ? `${home}${href}` : href} className="text-gray-400 transition-colors hover:text-white">
                      {t(`footer.links.${key}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-400">{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
