import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Users, Briefcase, PenTool, BarChart3, Handshake } from 'lucide-react';

const About = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const features = [
    { icon: FileText, id: 'content', ariaLabel: 'Content Creation Feature' },
    { icon: Users, id: 'suppliers', ariaLabel: 'Supplier Management Feature' },
    { icon: Briefcase, id: 'business', ariaLabel: 'Business Support Feature' },
    { icon: PenTool, id: 'design', ariaLabel: 'Creative Design Feature' },
    { icon: BarChart3, id: 'analytics', ariaLabel: 'Performance Tracking Feature' },
    { icon: Handshake, id: 'consulting', ariaLabel: 'Expert Consulting Feature' }
  ];

  return (
    <section 
      id="about" 
      className="py-24 bg-white dark:bg-primary overflow-hidden"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Decorative elements */}
          <div 
            className="absolute inset-0 grid grid-cols-2"
            aria-hidden="true"
          >
            <div className="bg-gradient-to-br from-purple-500/5 to-transparent blur-3xl" />
            <div className="bg-gradient-to-bl from-blue-500/5 to-transparent blur-3xl" />
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div 
                className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full mb-4"
                aria-hidden="true"
              >
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 
                id="about-heading"
                className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6"
              >
                {t('about.title')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t('about.subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`space-y-8 ${isRTL ? 'md:order-2' : ''}`}
              >
                <p className="text-lg text-gray-600 dark:text-gray-300 text-center md:text-start">
                  {t('about.description')}
                </p>

                <div 
                  className="grid grid-cols-2 gap-6"
                  role="list"
                  aria-label="Company features"
                >
                  {features.map(({ icon: Icon, id, ariaLabel }) => (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                      role="listitem"
                      aria-labelledby={`feature-heading-${id}`}
                    >
                      <div 
                        className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                        aria-hidden="true"
                      >
                        <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 
                          id={`feature-heading-${id}`}
                          className="font-medium text-black dark:text-white mb-1"
                        >
                          {t(`about.features.${id}.title`)}
                        </h3>
                        <p 
                          className="text-sm text-gray-500 dark:text-gray-400"
                          aria-describedby={`feature-heading-${id}`}
                        >
                          {t(`about.features.${id}.description`)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`relative ${isRTL ? 'md:order-1' : ''}`}
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000"
                    alt="Team collaborating on a digital project"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent"
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;