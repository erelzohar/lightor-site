import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const newIsDarkMode = document.documentElement.classList.contains('dark');
          if (newIsDarkMode !== isDarkMode) {
            setIsDarkMode(newIsDarkMode);
            if (vantaEffect) {
              vantaEffect.destroy();
              setVantaEffect(null);
            }
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    const loadVanta = async () => {
      if (!vantaEffect) {
        const VANTA = (await import('vanta/dist/vanta.birds.min')).default;
        setVantaEffect(
          VANTA({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: isDarkMode ? 0x611 : 0xffffff,
            color1: isDarkMode ? 0xf40 : 0xbd38c7,
            color2: isDarkMode ? 0x72296d : 0x09d1f9,
            birdSize: 1.10,
            separation: 27.00,
            backgroundAlpha: 0.99,
            THREE: window.THREE
          })
        );
      }
    };

    loadVanta();
    return () => {
      if (vantaEffect) vantaEffect.destroy();
      observer.disconnect();
    }
  }, [isDarkMode, vantaEffect]);


  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Lightor has no public phone number or social accounts to link to. The two
  // destinations that do exist are the signup flow and the owner dashboard.
  const socialLinks = [
    {
      icon: FaWhatsapp,
      href: 'https://register.lightor.app',
      label: 'Start free',
      color: 'text-white hover:text-white',
      bgColor: 'bg-violet-500/60 hover:bg-violet-500/70'
    },
    {
      icon: FaPhone,
      href: 'https://dashboard.lightor.app',
      label: 'Sign in',
      color: 'text-white hover:text-white',
      bgColor: 'bg-white/20 hover:bg-white/30'
    }
  ];


  return (
    <>
      <section
        ref={vantaRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-32"
        aria-label={t('hero.title')}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative inline-block"
              dir="ltr"
            >
              <h1 
                className="relative text-6xl md:text-7xl font-bold text-black dark:text-white mb-6 tracking-tight"
                aria-label={`${t('hero.title.part1')} ${t('hero.title.part2')} ${t('hero.title.part3')}`}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {t('hero.title.part1')} &nbsp;
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="inline-block"
                >
                  {t('hero.title.part2')} {t('hero.title.part3')}
                </motion.span>
              </h1>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="text-xl sm:text-2xl md:text-3xl font-semibold text-black dark:text-white mb-4"
            >
              {t('hero.subheader')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto font-light px-4"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="flex justify-center items-center px-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleScrollToAbout}
                className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium text-base sm:text-lg overflow-hidden max-w-xl mx-auto w-full"
                aria-label={t('hero.cta')}
              >
                <motion.div
                  className="absolute inset-0 bg-white mix-blend-overlay"
                  style={{
                    maskImage: 'radial-gradient(circle at center, transparent 50%, black 100%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, transparent 50%, black 100%)',
                  }}
                  animate={{
                    scale: [1, 2],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
                <span className="relative z-10 flex items-center justify-center">
                  {t('hero.cta')}
                  <ArrowRight 
                    className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform`}
                    aria-hidden="true"
                  />
                </span>
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className={`flex justify-center items-center ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'} mt-8`}
              role="navigation"
              aria-label="Social media links"
            >
              {socialLinks.map(({ icon: Icon, href, label, color, bgColor }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-xl backdrop-blur-sm ${bgColor} ${color} shadow-lg transition-all duration-300`}
                  aria-label={label}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;