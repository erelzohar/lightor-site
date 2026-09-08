import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// The three steps between signing up and taking a first booking. Kept in the
// component (not i18n) because each step carries its own image and gradient.
const projects = [
  {
    id: 1,
    title: '1. Tell Lightor about your business',
    titleHe: '1. מספרים ללייטור על העסק',
    description: 'A short conversation — what you do, which services you offer, when you work. No forms to fill in.',
    descriptionHe: 'שיחה קצרה — במה אתם עוסקים, אילו שירותים אתם נותנים ומתי אתם עובדים. בלי טפסים למלא.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    url: 'https://register.lightor.app',
    color: 'from-violet-500/20 to-purple-500/20'
  },
  {
    id: 2,
    title: '2. Your site goes live',
    titleHe: '2. האתר עולה לאוויר',
    description: 'Your booking page is written, styled and published at your own lightor.app address, ready to share.',
    descriptionHe: 'עמוד התורים נכתב, מעוצב ועולה לאוויר בכתובת lightor.app משלכם, מוכן לשליחה.',
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800',
    url: 'https://register.lightor.app',
    color: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    id: 3,
    title: '3. Customers book themselves',
    titleHe: '3. הלקוחות קובעים בעצמם',
    description: 'Bookings arrive in your calendar, confirmations and reminders go out on their own, and you get on with the work.',
    descriptionHe: 'התורים נכנסים ליומן, האישורים והתזכורות יוצאים לבד, ואתם ממשיכים לעבוד.',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=800',
    url: 'https://register.lightor.app',
    color: 'from-emerald-500/20 to-teal-500/20'
  }
];

const Projects = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  return (
    <section 
      id="projects" 
      className="py-32 bg-primary-light dark:bg-primary-dark overflow-hidden"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center relative z-10 mb-24"
        >
          <h2 
            id="projects-heading"
            className="text-5xl md:text-7xl font-bold text-black dark:text-white mb-8"
          >
            {t('projects.title')}
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        <div className="relative">
          {/* Background decorative elements */}
          <div 
            className="absolute inset-0 grid grid-cols-2 -m-8 h-[calc(100%+4rem)]"
            aria-hidden="true"
          >
            <div className="bg-gradient-to-br from-purple-500/5 to-transparent blur-3xl" />
            <div className="bg-gradient-to-bl from-blue-500/5 to-transparent blur-3xl" />
          </div>

          <div 
            className="relative space-y-20 md:space-y-40"
            role="list"
            aria-label="Featured Projects"
          >
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-20%" }}
                className="group"
                role="listitem"
                aria-labelledby={`project-title-${project.id}`}
              >
                <div className="relative rounded-[2rem] p-2 transition-all duration-500 bg-gradient-to-br hover:shadow-[0_0_2rem_0_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_2rem_0_rgba(255,255,255,0.1)]">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] backdrop-blur-xl"
                    aria-hidden="true"
                  />
                  
                  <div className="relative bg-white dark:bg-black rounded-[1.7rem] p-4 md:p-12 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                      aria-hidden="true"
                    />
                    
                    <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${isRTL ? 'md:rtl' : ''}`}>
                      <motion.div
                        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10 text-center md:text-start"
                      >
                        <h3 
                          id={`project-title-${project.id}`}
                          className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4 md:mb-6"
                        >
                          {isRTL ? project.titleHe : project.title}
                        </h3>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
                          {isRTL ? project.descriptionHe : project.description}
                        </p>
                        <div className={`flex flex-col sm:flex-row gap-4 justify-center md:justify-start ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto"
                          >
                            <a
                              href={project.url}
                              className="group/button overflow-hidden relative inline-flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium"
                              aria-label={`${isRTL ? 'צפה בפרויקט' : 'View Project'} - ${isRTL ? project.titleHe : project.title}`}
                            >
                              <span className="relative z-10">{isRTL ? 'צפה בפרויקט' : 'View Project'}</span>
                              <ArrowRight 
                                className={`relative z-10 w-5 h-5 transition-all duration-300 ${isRTL ? 'rotate-180 group-hover/button:-translate-x-1' : 'group-hover/button:translate-x-1'}`}
                                aria-hidden="true"
                              />
                              <div 
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"
                                aria-hidden="true"
                              />
                            </a>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto"
                          >
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/button overflow-hidden relative inline-flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium"
                              aria-label={`${isRTL ? 'להתחלה בחינם' : 'Start free'} - ${isRTL ? project.titleHe : project.title}`}
                            >
                              <span className="relative z-10">{isRTL ? 'להתחלה בחינם' : 'Start free'}</span>
                              <ArrowRight 
                                className="relative z-10 w-5 h-5 transition-all duration-300 group-hover/button:scale-110"
                                aria-hidden="true"
                              />
                              <div 
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"
                                aria-hidden="true"
                              />
                            </a>
                          </motion.div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="relative aspect-[4/3] rounded-2xl overflow-hidden order-first md:order-none"
                      >
                        <div 
                          className="absolute inset-0 bg-gradient-to-br opacity-20"
                          aria-hidden="true"
                        />
                        <img
                          src={project.image}
                          alt={`${isRTL ? project.titleHe : project.title} project screenshot`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div 
                          className="absolute inset-0 bg-gradient-to-tr from-black/20 via-black/0 to-black/0 group-hover:via-black/10 group-hover:to-black/20 transition-colors duration-500"
                          aria-hidden="true"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;