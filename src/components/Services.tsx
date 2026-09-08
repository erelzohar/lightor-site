import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Globe, Smartphone, MessageSquare, Laptop, Layout, Target } from 'lucide-react';

const services = [
  {
    id: 'site',
    Icon: Globe,
    features: ['aiBuilder', 'ownAddress', 'gallery', 'yourColours'],
    gradient: 'from-violet-500 to-purple-500',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000'
  },
  {
    id: 'booking',
    Icon: Layout,
    features: ['realTimeSlots', 'noDoubleBooking', 'selfService', 'addToCalendar'],
    gradient: 'from-indigo-500 to-blue-500',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2000'
  },
  {
    id: 'reminders',
    Icon: MessageSquare,
    features: ['confirmation', 'morning', 'whatsapp', 'ownerAlerts'],
    gradient: 'from-green-500 to-emerald-500',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=2000'
  },
  {
    id: 'schedule',
    Icon: Target,
    features: ['workingHours', 'breaks', 'overrides', 'vacations'],
    gradient: 'from-rose-500 to-pink-500',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000'
  },
  {
    id: 'customers',
    Icon: Laptop,
    features: ['directory', 'history', 'notes', 'block'],
    gradient: 'from-orange-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000'
  },
  {
    id: 'mobile',
    Icon: Smartphone,
    features: ['phoneFirst', 'anywhere', 'quickView', 'manageOnTheGo'],
    gradient: 'from-cyan-500 to-sky-500',
    image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80&w=2000'
  }
];

const ServiceSection = ({ service, index }) => {
  const ref = useRef(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.3, 1, 1, 0.3]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [100, 0, 0, -100]
  );

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ['20%', '-20%']
  );

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '100%']
  );

  return (
    <motion.div
      ref={ref}
      className="min-h-screen py-20 relative flex items-center"
      style={{ opacity, scale, y }}
      role="article"
      aria-labelledby={`service-title-${service.id}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `url(${service.image})`,
            y: backgroundY
          }}
          aria-hidden="true"
        />
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-8 text-center lg:text-start ${isRTL ? 'lg:order-2' : ''}`}>
            <div 
              className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.gradient}`}
              aria-hidden="true"
            >
              <service.Icon className="w-8 h-8 text-white" />
            </div>

            <h2 
              id={`service-title-${service.id}`}
              className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white"
            >
              {t(`services.${service.id}.title`)}
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t(`services.${service.id}.description`)}
            </p>

            <ul 
              className="grid sm:grid-cols-2 gap-4"
              aria-label={`Features of ${t(`services.${service.id}.title`)}`}
            >
              {service.features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center lg:justify-start space-x-3 rtl:space-x-reverse"
                >
                  <span 
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`}
                    aria-hidden="true"
                  />
                  <span className="text-lg text-gray-700 dark:text-gray-300">
                    {t(`services.${service.id}.features.${feature}`)}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div 
            className={`relative aspect-square ${isRTL ? 'lg:order-1' : ''}`}
            style={{ y: imageY }}
          >
            <motion.div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.gradient} shadow-2xl`}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-1 rounded-2xl bg-white dark:bg-gray-800 overflow-hidden">
                <img
                  src={service.image}
                  alt={t(`services.${service.id}.title`)}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const { t, i18n } = useTranslation();
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section 
      id="services" 
      className="bg-gray-50 dark:bg-primary overflow-hidden"
      aria-labelledby="services-heading"
    >
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto py-20 px-4"
      >
        <h1 
          id="services-heading"
          className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6"
        >
          {t('services.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {t('services.subtitle')}
        </p>
      </motion.div>

      {services.map((service, index) => (
        <ServiceSection key={service.id} service={service} index={index} />
      ))}
    </section>
  );
};

export default Services;