import { NextRequest, NextResponse } from 'next/server';
import { AIResponse, UserInput } from '@/types';

// MiniMax API 配置
const API_URL = process.env.MINIMAX_API_URL || 'https://api.minimaxi.com/v1/chat/completions';
const API_KEY = process.env.MINIMAX_API_KEY;
const API_MODEL = process.env.MINIMAX_MODEL || 'MiniMax-Text-01';

// System Prompt for sensitive-savior
const SYSTEM_PROMPT = `你是「说啥好呢」的 AI 助手，一位温暖、专业且富有同理心的心理咨询师和沟通顾问。

## 你的核心使命

帮助那些因说错话而陷入内耗、焦虑的敏感人群。你的任务是通过情绪安抚、客观分析和实用话术，帮助他们走出情绪困境。

## 你的人格特质

1. **温暖治愈**：像一位温柔的朋友，语气柔和、不说教
2. **专业理性**：能客观分析情况，提供有价值的视角
3. **实用主义**：给出的话术要真正能用、好用的
4. **不评判**：永远站在用户这边，不批评、不否定

## 回复格式要求

请严格按照以下 JSON 格式回复（不要有任何额外的文字）：

{
  "emotionalSupport": {
    "title": "情绪安抚",
    "content": "2-3句温暖、共情的话，肯定用户的感受是正常的"
  },
  "objectiveAnalysis": {
    "impactLevel": 2,
    "impactText": "很小",
    "points": [
      "降低事件严重性的角度1",
      "降低事件严重性的角度2",
      "降低事件严重性的角度3"
    ]
  },
  "recoveryScripts": {
    "optionA": {
      "style": "轻松幽默型",
      "emoji": "😄",
      "content": "适合轻松场合的话术"
    },
    "optionB": {
      "style": "认真解释型",
      "emoji": "😐",
      "content": "适合正式场合的话术"
    },
    "optionC": {
      "style": "转移话题型",
      "emoji": "😉",
      "content": "适合转移注意力的话术"
    }
  }
}

## 影响程度评级参考

- 1星（极小）：几乎没人会在意的事
- 2星（很小）：注意到的人也会很快忘记
- 3星（一般）：有一点尴尬，但不会影响关系
- 4星（较大）：需要适当补救，但仍可控
- 5星（重大）：需要认真处理，但总有办法`;

// 调用 MiniMax API
async function callAI(input: UserInput): Promise<AIResponse> {
  const userMessage = `【场景信息】
- 场景类型：${input.sceneType}
- 对谁说的：${input.target}
- 说了什么：${input.content}
- 当时情境：${input.context}
- 我的担忧：${input.worry}
- 我们的关系：${input.relationship}

请帮我分析这个情况，给我情绪安抚、客观分析和找补话术。`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: API_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      temperature: 1,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kimi API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const aiContent = data.choices?.[0]?.message?.content || '';

  // 解析 AI 返回的 JSON
  try {
    // 尝试提取 JSON 部分
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        ...parsed,
        responseTime: Date.now(),
      };
    }
  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError);
  }

  // 如果解析失败，返回默认结构
  return {
    emotionalSupport: {
      title: '情绪安抚',
      content: aiContent,
    },
    objectiveAnalysis: {
      impactLevel: 2,
      impactText: '很小',
      points: ['AI 响应解析失败，这是原始回复'],
    },
    recoveryScripts: {
      optionA: { style: '轻松幽默型', emoji: '😄', content: '请重新尝试' },
      optionB: { style: '认真解释型', emoji: '😐', content: '请重新尝试' },
      optionC: { style: '转移话题型', emoji: '😉', content: '请重新尝试' },
    },
    responseTime: Date.now(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input } = body as { input: UserInput };

    if (!input) {
      return NextResponse.json(
        { success: false, error: '缺少输入数据' },
        { status: 400 }
      );
    }

    // 验证必填字段
    const requiredFields = ['target', 'content', 'context', 'worry', 'relationship'];
    const missingFields = requiredFields.filter(
      (field) => !input[field as keyof UserInput]?.toString().trim()
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `缺少必填字段: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // 检查是否配置了 API Key
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: '未配置 API Key，请在环境变量中设置 MINIMAX_API_KEY' },
        { status: 500 }
      );
    }

    // 调用 AI
    const response = await callAI(input);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '服务器处理失败' },
      { status: 500 }
    );
  }
}
