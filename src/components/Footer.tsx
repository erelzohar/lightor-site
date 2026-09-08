import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const footerLinks = {
    company: [
      { en: 'How it works', he: 'איך זה עובד', href: '#about' },
      { en: 'Getting started', he: 'איך מתחילים', href: '#projects' }
    ],
    services: [
      { en: 'Features', he: 'מה מקבלים', href: '#services' },
      { en: 'Start free', he: 'התחלה בחינם', href: 'https://register.lightor.app' },
      { en: 'Sign in', he: 'כניסה', href: 'https://dashboard.lightor.app' }
    ],
    legal: [
      { en: 'Privacy Policy', he: 'מדיניות פרטיות', href: 'https://lightor.app/privacy.html' },
      { en: 'Terms of Service', he: 'תנאי שימוש', href: 'https://lightor.app/terms.html' }
    ],
  };


  const socialLinks = [
    {
      icon: FaWhatsapp,
      href: 'https://register.lightor.app',
      label: 'Start free',
      color: 'text-violet-400 hover:text-violet-300'
    },
    {
      icon: FaPhone,
      href: 'https://dashboard.lightor.app',
      label: 'Sign in',
      color: 'text-blue-400 hover:text-blue-300'
    }
  ];


  return (
    <>
      <footer 
        className="bg-black text-white dark:bg-primary-dark"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-2 lg:col-span-1 space-y-6">
              <div className="flex flex-col items-center lg:items-start">
                <motion.a
                  href="#home"
                  className="flex items-center mb-6 group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-pink-500 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Go to homepage"
                >
                  <div className="flex items-center">
                    <Code2 className="h-8 w-8 text-white" aria-hidden="true" />
                    <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-xl font-bold`}>Lightor</span>
                  </div>
                </motion.a>
                <p className="text-gray-400 text-center lg:text-start">
                  {isRTL 
                    ? 'בונים חוויות דיגיטליות יוצאות דופן לעסקים חדשניים'
                    : 'Building exceptional digital experiences for forward-thinking businesses.'
                  }
                </p>
                <nav 
                  className={`flex ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'} mt-6`}
                  aria-label="Social media links"
                >
                  {socialLinks.map(({ icon: Icon, href, label, color }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-full bg-white/5 hover:bg-white/10 ${color} transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-pink-500`}
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </motion.a>
                  ))}
                </nav>
              </div>
            </div>

            {Object.entries(footerLinks).map(([category, links]) => (
              <nav 
                key={category} 
                className="text-center lg:text-start"
                aria-label={t(`footer.${category}`)}
              >
                <h2 className="text-lg font-semibold mb-4">
                  {t(`footer.${category}`)}
                </h2>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.en}>
                      <a 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-pink-500 rounded-lg px-2 py-1 -mx-2"
                      >
                        {isRTL ? link.he : link.en}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;