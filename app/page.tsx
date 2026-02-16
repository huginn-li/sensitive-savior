'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import HomePage from '@/components/HomePage';
import LoadingPage from '@/components/LoadingPage';
import ResultPage from '@/components/ResultPage';
import Toast from '@/components/Toast';
import { UserInput, AIResponse, AppPage, Toast as ToastType } from '@/types';
import { generateId } from '@/lib/utils';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [input, setInput] = useState<UserInput | null>(null);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [toast, setToast] = useState<ToastType | null>(null);

  // Show toast notification
  const showToast = useCallback((message: string, type: ToastType['type'] = 'info') => {
    const id = generateId();
    setToast({ id, message, type });
    setTimeout(() => setToast(null), 2000);
  }, []);

  // Handle form submission
  const handleSubmit = async (userInput: UserInput) => {
    setInput(userInput);
    setCurrentPage('loading');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userInput }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        setResponse(data.data);
        setCurrentPage('result');
      } else {
        showToast(data.error || '请求失败，请重试', 'error');
        setCurrentPage('home');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast('网络错误，请检查网络后重试', 'error');
      setCurrentPage('home');
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentPage === 'result') {
      setCurrentPage('home');
    }
  };

  // Handle home navigation
  const handleHome = () => {
    setCurrentPage('home');
    setInput(null);
    setResponse(null);
  };

  // Handle restart
  const handleRestart = () => {
    setCurrentPage('home');
    setInput(null);
    setResponse(null);
  };

  // Handle history click
  const handleHistoryClick = () => {
    showToast('历史记录功能即将上线', 'info');
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <HomePage
            key="home"
            onSubmit={handleSubmit}
            onHistoryClick={handleHistoryClick}
          />
        )}

        {currentPage === 'loading' && (
          <LoadingPage key="loading" />
        )}

        {currentPage === 'result' && input && response && (
          <ResultPage
            key="result"
            input={input}
            response={response}
            onBack={handleBack}
            onHome={handleHome}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>

      <Toast toast={toast} />
    </>
  );
}
