'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, ChevronRight, Sparkles } from 'lucide-react';
import { UserInput, SceneType } from '@/types';
import { SCENE_CONFIGS } from '@/lib/constants';
import { cn, saveDraft, getDraft, clearDraft } from '@/lib/utils';

interface HomePageProps {
  onSubmit: (input: UserInput) => void;
  onHistoryClick?: () => void;
}

// Custom hook for handling Chinese IME composition
function useCompositionInput(
  value: string,
  onChange: (value: string) => void,
  maxLength?: number
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isComposingRef = useRef(false);
  const lastValueRef = useRef(value);

  useEffect(() => {
    if (textareaRef.current && !isComposingRef.current && value !== textareaRef.current.value) {
      textareaRef.current.value = value;
      lastValueRef.current = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (!textareaRef.current) return;

    const newValue = textareaRef.current.value;
    if (isComposingRef.current) {
      if (maxLength && newValue.length > maxLength) {
        textareaRef.current.value = newValue.slice(0, maxLength);
      }
      return;
    }

    if (newValue !== lastValueRef.current) {
      lastValueRef.current = newValue;
      onChange(newValue);
    }
  }, [onChange, maxLength]);

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(() => {
    isComposingRef.current = false;
    if (textareaRef.current) {
      const newValue = textareaRef.current.value;
      if (maxLength && newValue.length > maxLength) {
        textareaRef.current.value = newValue.slice(0, maxLength);
        onChange(newValue.slice(0, maxLength));
      } else {
        onChange(newValue);
      }
      lastValueRef.current = textareaRef.current.value;
    }
  }, [onChange, maxLength]);

  return {
    textareaRef,
    handleInput,
    handleCompositionStart,
    handleCompositionEnd,
  };
}

// Voice Input Button Component
function VoiceInputButton({
  onTranscript,
  isRecording,
  onStartRecording,
  onStopRecording,
}: {
  onTranscript: (text: string) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}) {
  const handleClick = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
      // Mock voice recognition - in production, use Web Speech API
      setTimeout(() => {
        onTranscript('');
        onStopRecording();
      }, 3000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center transition-all',
        isRecording
          ? 'bg-red-100 text-red-500 animate-pulse'
          : 'bg-primary-50 text-primary-500 hover:bg-primary-100'
      )}
      aria-label={isRecording ? '停止录音' : '开始语音输入'}
    >
      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
}

// Input Field Component
function InputField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  maxLength,
  showVoiceInput = true,
  isRecording,
  onStartRecording,
  onStopRecording,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  maxLength?: number;
  showVoiceInput?: boolean;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}) {
  const { textareaRef, handleInput, handleCompositionStart, handleCompositionEnd } =
    useCompositionInput(value, onChange, maxLength);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">{label}</label>
        {showVoiceInput && (
          <VoiceInputButton
            onTranscript={onChange}
            isRecording={isRecording}
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
          />
        )}
      </div>
      {multiline ? (
        <>
          <textarea
            ref={textareaRef}
            defaultValue={value}
            onInput={handleInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={placeholder}
            className="input-field min-h-[80px] resize-none"
            maxLength={maxLength}
            rows={3}
          />
          {maxLength && (
            <p className="text-xs text-neutral-400 text-right">
              {value.length}/{maxLength}
            </p>
          )}
        </>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field"
          maxLength={maxLength}
        />
      )}
    </div>
  );
}

export default function HomePage({ onSubmit, onHistoryClick }: HomePageProps) {
  const [selectedScene, setSelectedScene] = useState<SceneType | null>(null);
  const [recordingField, setRecordingField] = useState<string | null>(null);
  const [input, setInput] = useState<UserInput>({
    sceneType: 'custom',
    target: '',
    content: '',
    context: '',
    worry: '',
    relationship: '',
  });

  // Load draft on mount
  useEffect(() => {
    const draft = getDraft() as Partial<UserInput> | null;
    if (draft && Object.keys(draft).length > 0) {
      setInput((prev) => ({ ...prev, ...draft }));
      if (draft.sceneType) {
        setSelectedScene(draft.sceneType);
      }
    }
  }, []);

  // Save draft on input change
  useEffect(() => {
    saveDraft(input);
  }, [input]);

  // Handle scene selection
  const handleSceneSelect = (sceneId: SceneType) => {
    const scene = SCENE_CONFIGS.find((s) => s.id === sceneId);
    setSelectedScene(sceneId);

    if (scene?.example) {
      setInput((prev) => ({
        ...prev,
        sceneType: sceneId,
        ...scene.example,
      }));
    } else {
      setInput((prev) => ({
        ...prev,
        sceneType: sceneId,
      }));
    }
  };

  // Check if form is valid
  const isFormValid =
    input.target.trim() &&
    input.content.trim() &&
    input.context.trim() &&
    input.worry.trim() &&
    input.relationship.trim();

  // Handle submit
  const handleSubmit = () => {
    if (!isFormValid) return;
    clearDraft();
    onSubmit(input);
  };

  // Recording handlers
  const handleStartRecording = (field: string) => {
    setRecordingField(field);
  };

  const handleStopRecording = () => {
    setRecordingField(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-neutral-100 safe-area-top">
          <div className="flex items-center justify-between px-5 h-[60px]">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <span className="text-lg font-semibold text-primary-600">说啥好呢</span>
            </div>
            {onHistoryClick && (
              <button
                onClick={onHistoryClick}
                className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700"
              >
                <span>历史</span>
                <span>📋</span>
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Welcome Section */}
          <section className="px-5 py-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                说错话了？
              </h1>
              <p className="text-lg text-neutral-600 mb-4">
                别慌，我来帮你 <span className="text-primary-500">💚</span>
              </p>
              <p className="text-sm text-neutral-400">
                这里的每一句话，都是为你准备的温暖
              </p>
            </motion.div>
          </section>

          {/* Scene Selection */}
          <section className="px-5 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-neutral-800">
                快速选择场景
              </h2>
              <button
                onClick={() => handleSceneSelect('custom')}
                className={cn(
                  'text-sm px-3 py-1.5 rounded-full transition-all',
                  selectedScene === 'custom'
                    ? 'bg-primary-500 text-white'
                    : 'btn-secondary'
                )}
              >
                ✏️ 自定义
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {SCENE_CONFIGS.filter((s) => s.id !== 'custom').map((scene) => (
                <motion.button
                  key={scene.id}
                  onClick={() => handleSceneSelect(scene.id)}
                  className={cn('scene-card h-[72px]', {
                    selected: selectedScene === scene.id,
                  })}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-2xl mb-1">{scene.emoji}</span>
                  <span className="text-sm text-neutral-700">{scene.label}</span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="mx-5 h-px bg-neutral-100" />

          {/* Input Form */}
          <section className="px-5 py-6 space-y-5">
            <h2 className="text-base font-semibold text-neutral-800">
              告诉我详情
            </h2>

            <InputField
              label="对谁说的"
              value={input.target}
              onChange={(value) => setInput((prev) => ({ ...prev, target: value }))}
              placeholder="例如：我的直属领导李总"
              isRecording={recordingField === 'target'}
              onStartRecording={() => handleStartRecording('target')}
              onStopRecording={handleStopRecording}
            />

            <InputField
              label="说了什么"
              value={input.content}
              onChange={(value) => setInput((prev) => ({ ...prev, content: value }))}
              placeholder='例如：把"目标"说成了"鸡毛"'
              multiline
              maxLength={100}
              isRecording={recordingField === 'content'}
              onStartRecording={() => handleStartRecording('content')}
              onStopRecording={handleStopRecording}
            />

            <InputField
              label="当时情境"
              value={input.context}
              onChange={(value) => setInput((prev) => ({ ...prev, context: value }))}
              placeholder="例如：在季度总结会上，当着全部门的面..."
              multiline
              maxLength={100}
              isRecording={recordingField === 'context'}
              onStartRecording={() => handleStartRecording('context')}
              onStopRecording={handleStopRecording}
            />

            <InputField
              label="你的担忧"
              value={input.worry}
              onChange={(value) => setInput((prev) => ({ ...prev, worry: value }))}
              placeholder="例如：担心领导觉得我不专业"
              isRecording={recordingField === 'worry'}
              onStartRecording={() => handleStartRecording('worry')}
              onStopRecording={handleStopRecording}
            />

            <InputField
              label="你们关系"
              value={input.relationship}
              onChange={(value) => setInput((prev) => ({ ...prev, relationship: value }))}
              placeholder="例如：入职三个月，领导比较严肃"
              isRecording={recordingField === 'relationship'}
              onStartRecording={() => handleStartRecording('relationship')}
              onStopRecording={handleStopRecording}
            />
          </section>
        </div>

        {/* Footer */}
        <footer className="sticky bottom-0 bg-white border-t border-neutral-100 safe-area-bottom">
          <div className="px-5 py-4 space-y-3">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>获取 AI 建议</span>
            </button>
            <p className="text-xs text-neutral-400 text-center">
              放心，一切都会好的
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
