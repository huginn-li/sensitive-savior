// Scene Types
export type SceneType =
  | 'leader'      // 领导/长辈
  | 'crush'       // 暗恋对象
  | 'moments'     // 朋友圈
  | 'social'      // 社交场合
  | 'friend'      // 朋友误会
  | 'colleague'   // 同事尴尬
  | 'custom';     // 自定义场景

// Scene Configuration
export interface SceneConfig {
  id: SceneType;
  label: string;
  emoji: string;
  example?: Partial<UserInput>;
}

// User Input Data
export interface UserInput {
  sceneType: SceneType;
  target: string;      // 对谁说的
  content: string;     // 说了什么
  context: string;     // 当时情境
  worry: string;       // 你的担忧
  relationship: string; // 你们关系
}

// AI Response - Recovery Script Option
export interface RecoveryScript {
  style: string;       // 方案风格：轻松幽默型、认真解释型、转移话题型
  content: string;     // 话术内容
  emoji: string;       // 表情符号
}

// AI Response - Objective Analysis
export interface ObjectiveAnalysis {
  impactLevel: number; // 1-5星
  impactText: string;  // 影响程度文字描述
  points: string[];    // 分析要点
}

// AI Response - Emotional Support
export interface EmotionalSupport {
  title: string;
  content: string;
}

// Complete AI Response
export interface AIResponse {
  emotionalSupport: EmotionalSupport;
  objectiveAnalysis: ObjectiveAnalysis;
  recoveryScripts: {
    optionA: RecoveryScript;
    optionB: RecoveryScript;
    optionC: RecoveryScript;
  };
  responseTime?: number;
}

// History Record
export interface HistoryRecord {
  id: string;
  input: UserInput;
  response: AIResponse;
  createdAt: number;
}

// App State
export type AppPage = 'home' | 'loading' | 'result';

export interface AppState {
  currentPage: AppPage;
  input: UserInput;
  response: AIResponse | null;
  isLoading: boolean;
  selectedScene: SceneType | null;
}

// API Request/Response Types
export interface AnalyzeRequest {
  input: UserInput;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AIResponse;
  error?: string;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}
