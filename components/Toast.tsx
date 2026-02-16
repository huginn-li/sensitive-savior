'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Toast as ToastType } from '@/types';

interface ToastProps {
  toast: ToastType | null;
}

export default function Toast({ toast }: ToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="toast"
        >
          <span>
            {toast.type === 'success' && '✓ '}
            {toast.type === 'error' && '✗ '}
            {toast.message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
