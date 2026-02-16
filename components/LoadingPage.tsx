'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOADING_MESSAGES } from '@/lib/constants';
import { randomItem } from '@/lib/utils';

export default function LoadingPage() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);

  // Initialize messages with random order
  useEffect(() => {
    const shuffled = [...LOADING_MESSAGES].sort(() => Math.random() - 0.5);
    setMessages(shuffled);
  }, []);

  // Rotate messages every 2 seconds
  useEffect(() => {
    if (messages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="min-h-screen bg-neutral-50 flex justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col items-center justify-center px-8">
        {/* Animated Logo */}
        <motion.div
          className="relative w-24 h-24 mb-8"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-blue-200 rounded-full flex items-center justify-center">
            <motion.span
              className="text-4xl"
              animate={{
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              🌿
            </motion.span>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          className="text-lg text-neutral-700 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          正在为你分析中...
        </motion.h2>

        {/* Comfort Messages */}
        <div className="h-20 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {messages.length > 0 && (
              <motion.p
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-neutral-500 text-center leading-relaxed max-w-xs"
              >
                {messages[currentMessageIndex]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Loading Dots */}
        <div className="flex gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary-400 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
