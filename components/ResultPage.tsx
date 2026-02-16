'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Copy, Check, Camera, Share2, RotateCcw } from 'lucide-react';
import html2canvas from 'html2canvas';
import { AIResponse, UserInput } from '@/types';
import { cn, copyToClipboard, generateStars } from '@/lib/utils';

interface ResultPageProps {
  input: UserInput;
  response: AIResponse;
  onBack: () => void;
  onHome: () => void;
  onRestart: () => void;
}

// Star Rating Component
function StarRating({ level, impactText }: { level: number; impactText: string }) {
  const { filled, empty } = generateStars(level);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: filled }).map((_, i) => (
          <span key={`filled-${i}`} className="text-xl text-primary-500">
            ★
          </span>
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <span key={`empty-${i}`} className="text-xl text-neutral-300">
            ★
          </span>
        ))}
      </div>
      <span className="text-sm font-medium text-primary-700">
        ({impactText})
      </span>
    </div>
  );
}

// Copy Button Component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all',
        copied
          ? 'bg-primary-100 text-primary-700'
          : 'border border-amber-400 text-amber-700 hover:bg-amber-50'
      )}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>已复制</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>复制</span>
        </>
      )}
    </button>
  );
}

// Script Card Component
function ScriptCard({
  optionKey,
  style,
  emoji,
  content,
}: {
  optionKey: string;
  style: string;
  emoji: string;
  content: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + (optionKey === 'A' ? 0 : optionKey === 'B' ? 0.1 : 0.2) }}
      className="bg-script-card-bg rounded-xl p-4 border border-script-border"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-script-text">
            方案 {optionKey} · {style}
          </span>
          <span className="text-lg">{emoji}</span>
        </div>
      </div>
      <p className="text-sm text-amber-900 leading-relaxed italic mb-3">
        "{content}"
      </p>
      <div className="flex justify-end">
        <CopyButton text={content} />
      </div>
    </motion.div>
  );
}

// Result Card Component
function ResultCard({
  type,
  title,
  emoji,
  children,
  delay = 0,
}: {
  type: 'comfort' | 'analysis' | 'script';
  title: string;
  emoji: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn('result-card', type)}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{emoji}</span>
        <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
      </div>
      <div className="border-t border-black/10 pt-4">{children}</div>
    </motion.div>
  );
}

export default function ResultPage({
  input,
  response,
  onBack,
  onHome,
  onRestart,
}: ResultPageProps) {
  const resultCardRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Handle save image
  const handleSaveImage = async () => {
    if (!resultCardRef.current) return;

    setIsSaving(true);
    try {
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `说啥好呢-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to save image:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!resultCardRef.current) return;

    try {
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        if (navigator.share) {
          const file = new File([blob], 'share.png', { type: 'image/png' });
          await navigator.share({
            files: [file],
            title: '说啥好呢',
            text: '这是我收到的温暖建议，希望也能帮到你',
          });
        } else {
          // Fallback to save
          handleSaveImage();
        }
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex justify-center">
      <div className="w-full max-w-[480px] bg-neutral-50 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-neutral-100 safe-area-top">
          <div className="flex items-center justify-between px-5 h-[60px]">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回</span>
            </button>
            <button
              onClick={onHome}
              className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700"
            >
              <Home className="w-4 h-4" />
              <span>首页</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {/* Hidden card for image generation */}
          <div className="hidden">
            <div ref={resultCardRef} className="bg-white p-6 rounded-2xl">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-primary-600 mb-2">🌿 说啥好呢</h2>
                <p className="text-neutral-600">你没做错什么，一切都会好的</p>
              </div>
              <div className="border-t border-neutral-200 pt-4 mb-4">
                <p className="text-sm text-neutral-700">
                  {response.emotionalSupport.content.split('\n')[0]}
                </p>
              </div>
              <div className="border-t border-neutral-200 pt-4">
                <p className="text-sm font-medium text-neutral-600 mb-2">💬 你可以这样说：</p>
                <p className="text-sm text-amber-800 italic">
                  "{response.recoveryScripts.optionA.content}"
                </p>
              </div>
            </div>
          </div>

          {/* Emotional Support Card */}
          <ResultCard type="comfort" title="情绪安抚" emoji="💚" delay={0.1}>
            <p className="text-blue-900 leading-relaxed whitespace-pre-line">
              {response.emotionalSupport.content}
            </p>
          </ResultCard>

          {/* Objective Analysis Card */}
          <ResultCard type="analysis" title="客观分析" emoji="🎯" delay={0.3}>
            <div className="mb-4">
              <p className="text-sm text-neutral-600 mb-2">这件事的实际影响：</p>
              <StarRating
                level={response.objectiveAnalysis.impactLevel}
                impactText={response.objectiveAnalysis.impactText}
              />
            </div>
            <ul className="space-y-2">
              {response.objectiveAnalysis.points.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-green-800">
                  <span className="text-primary-500 mt-0.5">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </ResultCard>

          {/* Recovery Scripts Card */}
          <ResultCard type="script" title="找补话术" emoji="💬" delay={0.5}>
            <div className="space-y-4">
              <ScriptCard
                optionKey="A"
                style={response.recoveryScripts.optionA.style}
                emoji={response.recoveryScripts.optionA.emoji}
                content={response.recoveryScripts.optionA.content}
              />
              <ScriptCard
                optionKey="B"
                style={response.recoveryScripts.optionB.style}
                emoji={response.recoveryScripts.optionB.emoji}
                content={response.recoveryScripts.optionB.content}
              />
              <ScriptCard
                optionKey="C"
                style={response.recoveryScripts.optionC.style}
                emoji={response.recoveryScripts.optionC.emoji}
                content={response.recoveryScripts.optionC.content}
              />
            </div>
          </ResultCard>
        </div>

        {/* Footer */}
        <footer className="sticky bottom-0 bg-white border-t border-neutral-100 safe-area-bottom">
          <div className="px-5 py-4">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleSaveImage}
                disabled={isSaving}
                className="flex flex-col items-center gap-1 py-3 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-all"
              >
                <Camera className="w-5 h-5" />
                <span className="text-xs">保存图片</span>
              </button>
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1 py-3 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-all"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-xs">分享</span>
              </button>
              <button
                onClick={onRestart}
                className="flex flex-col items-center gap-1 py-3 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="text-xs">重新输入</span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
