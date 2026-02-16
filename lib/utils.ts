import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

// Format time elapsed
export function formatTimeElapsed(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  return '刚刚';
}

// Generate star rating string
export function generateStars(level: number, maxLevel: number = 5): { filled: number; empty: number } {
  return {
    filled: Math.min(level, maxLevel),
    empty: Math.max(maxLevel - level, 0),
  };
}

// Local Storage Helpers
const STORAGE_KEYS = {
  HISTORY: 'sensitive-savior-history',
  DRAFT: 'sensitive-savior-draft',
} as const;

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function getHistory() {
  return loadFromStorage(STORAGE_KEYS.HISTORY, []);
}

export function saveHistory(history: unknown[]) {
  saveToStorage(STORAGE_KEYS.HISTORY, history);
}

export function getDraft() {
  return loadFromStorage(STORAGE_KEYS.DRAFT, {});
}

export function saveDraft(draft: unknown) {
  saveToStorage(STORAGE_KEYS.DRAFT, draft);
}

export function clearDraft() {
  localStorage.removeItem(STORAGE_KEYS.DRAFT);
}

// Validate user input
export function validateInput(input: Partial<import('@/types').UserInput>): {
  isValid: boolean;
  missingFields: string[];
} {
  const requiredFields: (keyof import('@/types').UserInput)[] = [
    'target',
    'content',
    'context',
    'worry',
    'relationship',
  ];

  const missingFields = requiredFields.filter((field) => !input[field]?.trim());

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

// Delay helper
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Random item from array
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
