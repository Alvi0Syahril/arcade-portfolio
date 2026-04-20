import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="glass-panel p-8"
    >
      <h2 className="text-3xl font-bold mb-4 text-electric-blue">About Me</h2>
      <p className="text-lg leading-relaxed text-gray-300">
        With over a decade of experience bridging the gap between intricate backend architectures and fluid frontend experiences, I specialize in building data-intensive applications. My current focus is integrating AI securely into application layers.
      </p>
    </motion.section>
  );
}
