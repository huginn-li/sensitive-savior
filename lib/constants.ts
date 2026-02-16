import { SceneConfig, UserInput } from '@/types';

// Scene Configurations
export const SCENE_CONFIGS: SceneConfig[] = [
  {
    id: 'leader',
    label: '领导/长辈',
    emoji: '👔',
    example: {
      target: '我的直属领导李总',
      content: '把"季度目标"说成了"季度鸡毛"',
      context: '在季度总结会上，当着全部门的面说的',
      worry: '担心领导觉得我不专业，影响晋升',
      relationship: '入职三个月，领导平时比较严肃',
    },
  },
  {
    id: 'crush',
    label: '暗恋对象',
    emoji: '💕',
    example: {
      target: '我暗恋的大学同学',
      content: '她问我周末干嘛，我说"在家发呆"',
      context: '微信聊天，本想约她出来',
      worry: '担心她觉得我无趣，没戏了',
      relationship: '认识半年，偶尔一起上课',
    },
  },
  {
    id: 'moments',
    label: '朋友圈',
    emoji: '📱',
    example: {
      target: '朋友圈所有人',
      content: '发了一张自拍，但配文很尴尬',
      context: '朋友圈，3小时过去了没人点赞',
      worry: '大家会不会觉得我很自恋很蠢',
      relationship: '微信好友几百人',
    },
  },
  {
    id: 'social',
    label: '社交场合',
    emoji: '🎉',
    example: {
      target: '刚认识的朋友',
      content: '不小心问了对方不想提的话题',
      context: '朋友聚会上，大家都在聊天',
      worry: '担心对方觉得我没情商',
      relationship: '第一次见面，朋友介绍认识的',
    },
  },
  {
    id: 'friend',
    label: '朋友误会',
    emoji: '👥',
    example: {
      target: '我的好朋友',
      content: '开玩笑说了一句不太合适的话',
      context: '两个人吃饭时聊到敏感话题',
      worry: '怕她当真了，影响我们友谊',
      relationship: '认识5年的好朋友',
    },
  },
  {
    id: 'colleague',
    label: '同事尴尬',
    emoji: '💼',
    example: {
      target: '隔壁组的同事',
      content: '误以为对方是实习生，说了些不合适的话',
      context: '茶水间闲聊',
      worry: '担心同事对我印象不好',
      relationship: '偶尔有工作交集',
    },
  },
];

// Comfort Messages for Loading State
export const LOADING_MESSAGES = [
  '别担心，这只是一次小小的社交经历而已',
  '你能够意识到问题，本身就很棒了',
  '每个人都会说错话，这是人之常情',
  '让我们来看看有什么好的解决办法',
  '深呼吸，一切都没你想象的那么严重',
];

// Mock AI Responses by Scene Type
export const MOCK_RESPONSES: Record<string, Partial<import('@/types').AIResponse>> = {
  leader: {
    emotionalSupport: {
      title: '情绪安抚',
      content: '抱抱你！先深呼吸一下，这种事情真的太常见了。\n\n你并没有做错什么大不了的事情，这只是一个小的口误。\n\n没有人会因为一句话就否定你整个人。',
    },
    objectiveAnalysis: {
      impactLevel: 2,
      impactText: '很小',
      points: [
        '大多数人根本不会注意到这个小失误',
        '即使注意到，也会很快忘记',
        '领导更看重的是你的工作成果，不是口才',
        '职场中谁没说过错话？这是人之常情',
      ],
    },
  },
  crush: {
    emotionalSupport: {
      title: '情绪安抚',
      content: '抱抱你！感情中的焦虑我完全理解。\n\n你的回复虽然不是最完美的，但至少是真实的你。\n\n真正喜欢你的人，会喜欢真实的你。',
    },
    objectiveAnalysis: {
      impactLevel: 2,
      impactText: '很小',
      points: [
        '一句"发呆"不会让对方对你失去兴趣',
        '很多人周末确实就是宅在家里',
        '对方可能觉得你很真实、不做作',
        '真正重要的是持续互动，不是某一次对话',
      ],
    },
  },
  moments: {
    emotionalSupport: {
      title: '情绪安抚',
      content: '抱抱你！朋友圈没人点赞的感觉确实不好受。\n\n但这绝不代表你发的内容有问题。\n\n很多时候大家只是没看到，或者忘了点。',
    },
    objectiveAnalysis: {
      impactLevel: 1,
      impactText: '几乎没有',
      points: [
        '朋友圈算法不会把内容推给所有人',
        '很多人刷朋友圈时只是随手滑过',
        '别人没点赞不等于不喜欢你',
        '你值得被喜欢，不需要点赞来证明',
      ],
    },
  },
  social: {
    emotionalSupport: {
      title: '情绪安抚',
      content: '社交场合的紧张和失误，每个人都经历过。\n\n你不是故意的，这种无心之失值得被原谅。\n\n真正重要的是你的态度，而不是那个失误。',
    },
    objectiveAnalysis: {
      impactLevel: 2,
      impactText: '很小',
      points: [
        '新认识的人通常不会因为一句话下定论',
        '大多数人对初次见面都很宽容',
        '对方可能根本没放在心上',
        '社交失误是常态，不必过度解读',
      ],
    },
  },
  friend: {
    emotionalSupport: {
      title: '情绪安抚',
      content: '真正的朋友之间，小误会太正常了。\n\n你们五年的友谊，不会因为一句话就动摇。\n\n你的担心说明你很在意这段友谊，这很珍贵。',
    },
    objectiveAnalysis: {
      impactLevel: 2,
      impactText: '很小',
      points: [
        '好朋友之间有误会很正常',
        '五年的交情经得起小摩擦',
        '真正的朋友会理解你的本意',
        '过度纠结反而可能让事情变大',
      ],
    },
  },
  colleague: {
    emotionalSupport: {
      title: '情绪安抚',
      content: '职场中的尴尬时刻每个人都遇到过。\n\n你无心冒犯，这一点对方一定能感受到。\n\n不要让这个小插曲影响你的工作状态。',
    },
    objectiveAnalysis: {
      impactLevel: 2,
      impactText: '很小',
      points: [
        '同事之间的小误会每天都会发生',
        '对方可能根本没当回事',
        '工作能力比社交技巧更重要',
        '大多数人只关注自己的事',
      ],
    },
  },
  default: {
    emotionalSupport: {
      title: '情绪安抚',
      content: '我能感受到你现在的焦虑。其实很多人都有类似的经历。\n\n你已经很在意别人的感受了，这说明你是个善良的人。\n\n没有人会因为一句话就否定你整个人。',
    },
    objectiveAnalysis: {
      impactLevel: 2,
      impactText: '很小',
      points: [
        '大多数人对小失误都很健忘',
        '人们更关注自己，而不是评判你',
        '你的本意是好的，这才是最重要的',
        '每个人都有说错话的时候',
      ],
    },
  },
};

// Default Recovery Scripts
export const DEFAULT_RECOVERY_SCRIPTS = {
  optionA: {
    style: '轻松幽默型',
    emoji: '😄',
    content: '哈哈，看来我今天状态不太好，说得有点乱，大家见笑啦！',
  },
  optionB: {
    style: '认真解释型',
    emoji: '😐',
    content: '不好意思，我刚才表达得不够清楚，让我重新说明一下...',
  },
  optionC: {
    style: '转移话题型',
    emoji: '😉',
    content: '说到这个，我正好想到另一个有趣的事...',
  },
};
