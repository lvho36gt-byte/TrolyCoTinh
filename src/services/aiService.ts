export interface LessonPlanRequest {
  subject: string;
  bookSet: string;
  week: string;
  period: string;
  topic: string;
  duration: string;
  organization: string;
  specialRequirements?: string;
  layoutStyle?: string;
}

export interface MaterialRequest {
  materialType: 'worksheet' | 'exam' | 'differentiated' | 'rubric' | 'mindmap' | 'task_cards';
  subject: string;
  topic: string;
  grade: string;
  levels: string[];
  questionCount: number;
  versions: number;
  extraNotes?: string;
}

export interface GameRequest {
  gameType: 'millionaire' | 'match' | 'secret_doors' | 'wheel' | 'flashcard';
  subject: string;
  topic: string;
  count: number;
}

export interface FeedbackRequest {
  studentName: string;
  gender: 'nam' | 'nữ';
  subject: string;
  term: string;
  completionLevel: 'T' | 'H' | 'C';
  strengths: string;
  needsSupport: string;
  evidence: string;
}

export interface ChatRequest {
  persona: 'teacher_assistant' | 'grade4_tutor';
  subject: string;
  message: string;
  conversationHistory?: Array<{ sender: string; content: string }>;
}

export const AiService = {
  async generateLessonPlan(params: LessonPlanRequest) {
    const res = await fetch('/api/ai/lesson-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Lỗi máy chủ (${res.status})`);
    }
    return await res.json();
  },

  async generateMaterial(params: MaterialRequest) {
    const res = await fetch('/api/ai/material', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Lỗi máy chủ (${res.status})`);
    }
    return await res.json();
  },

  async generateGameQuestions(params: GameRequest) {
    const res = await fetch('/api/ai/game-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Lỗi máy chủ (${res.status})`);
    }
    return await res.json();
  },

  async generateStudentFeedback(params: FeedbackRequest) {
    const res = await fetch('/api/ai/student-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Lỗi máy chủ (${res.status})`);
    }
    return await res.json();
  },

  async sendChatMessage(params: ChatRequest) {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Lỗi máy chủ (${res.status})`);
    }
    return await res.json();
  },

  async processQuickCommand(promptText: string) {
    const res = await fetch('/api/ai/quick-command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptText }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Lỗi máy chủ (${res.status})`);
    }
    return await res.json();
  }
};
