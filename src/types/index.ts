export type UserRole = 'teacher' | 'student' | 'judge';

export interface TeacherProfile {
  name: string;
  title: string;
  school: string;
  district: string;
  province: string;
  className: string;
  academicYear: string;
  mainSubject: string;
  defaultBookSet: string;
  avatarUrl?: string;
  bio: string;
}

export interface Student {
  id: string;
  code: string; // e.g. HS01, HS02
  name: string;
  gender: 'nam' | 'nữ';
  team: string; // Tổ 1, Tổ 2, Tổ 3, Tổ 4
  avatar?: string;
  attendanceStatus: 'present' | 'absent' | 'late';
  mathLevel: 'T' | 'H' | 'C'; // Hoàn thành tốt, Hoàn thành, Chưa hoàn thành
  vietnameseLevel: 'T' | 'H' | 'C';
  strengths: string;
  needsSupport: string;
  totalPoints: number;
  badges: string[];
}

export interface LessonPlanActivity {
  step: number;
  name: string;
  goal: string;
  teacherActivity: string;
  studentActivity: string;
  expectedProduct: string;
  assessment: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  bookSet: string;
  grade: string;
  week: string;
  period: string;
  topic: string;
  duration: string;
  requirements: {
    competencies: {
      specific: string[];
      general: string[];
    };
    qualities: string[];
  };
  preparation: {
    teacher: string[];
    student: string[];
  };
  activities: LessonPlanActivity[];
  reflection: string;
  suggestedTeacherDialogue?: string;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}

export interface MaterialQuestion {
  id: number;
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  content: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  guide?: string;
  score?: string;
  modelAnswer?: string;
}

export interface MaterialSection {
  title: string;
  questions: MaterialQuestion[];
}

export interface MaterialRubricItem {
  criterion: string;
  excellent: string;
  good: string;
  needsImprovement: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  materialType: 'worksheet' | 'exam' | 'differentiated' | 'rubric' | 'mindmap' | 'task_cards';
  subject: string;
  grade: string;
  topic: string;
  headerInfo: {
    school: string;
    class: string;
    subject: string;
    timeLimit: string;
  };
  instructions: string;
  sections: MaterialSection[];
  rubric?: MaterialRubricItem[];
  teacherNotes?: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface GameMillionaireQuestion {
  id: number;
  level: number;
  point: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  funFact: string;
}

export interface GameMatchPair {
  id: number;
  left: string;
  right: string;
}

export interface GameSecretDoor {
  doorNumber: number;
  question: string;
  answer: string;
  revealedClue: string;
}

export interface GameWheelSector {
  id: number;
  label: string;
  points: number;
  question: string;
  options: string[];
  correct: string;
}

export interface GameFlashcard {
  id: number;
  front: string;
  back: string;
  mnemonic: string;
}

export interface InteractiveGame {
  id: string;
  title: string;
  gameType: 'millionaire' | 'match' | 'secret_doors' | 'wheel' | 'flashcard';
  subject: string;
  topic: string;
  data: {
    questions?: GameMillionaireQuestion[];
    pairs?: GameMatchPair[];
    doors?: GameSecretDoor[];
    secretKeyword?: string;
    sectors?: GameWheelSector[];
    cards?: GameFlashcard[];
  };
  createdAt: string;
  playCount: number;
  highestScore: number;
  isFavorite?: boolean;
}

export interface StudentFeedback {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  term: string;
  completionLevel: 'T' | 'H' | 'C';
  strengths: string;
  needsSupport: string;
  evidence: string;
  shortComment: string;
  detailedComment: string;
  competencyFeedback: {
    selfStudy: string;
    collaboration: string;
    problemSolving: string;
  };
  qualityFeedback: string;
  suggestedActionsForTeacher: string;
  suggestedActionsForParents: string;
  createdAt: string;
  approvedByTeacher: boolean;
}

export interface OnlineQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  topic: string;
  dueDate: string;
  durationMinutes: number;
  totalPoints: number;
  questions: OnlineQuizQuestion[];
  status: 'active' | 'closed';
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalScore: number;
  answers: Record<number, number>;
  submittedAt: string;
  timeSpentSeconds: number;
}

export interface ActivityLog {
  id: string;
  type: 'plan' | 'material' | 'game' | 'feedback' | 'assignment' | 'system';
  title: string;
  description: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
