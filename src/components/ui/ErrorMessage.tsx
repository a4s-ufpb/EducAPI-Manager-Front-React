import { motion, AnimatePresence } from 'motion/react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
