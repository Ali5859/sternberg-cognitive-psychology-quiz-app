export interface Chapter {
    id: number;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

export interface Question {
    id: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    topic: string;
}

export interface UserAnswer {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
}

export interface QuizResult {
    score: number;
    answers: UserAnswer[];
    questions: Question[];
    analysis: string;
}

export enum AppState {
    STARTUP,
    API_KEY_SETUP,
    HOME,
    LOADING_QUIZ,
    QUIZ,
    LOADING_ANALYSIS,
    RESULTS,
    PRACTICE,
    STATS,
    BOOKMARKS,
}

export enum Difficulty {
    EASY = 'آسان',
    MEDIUM = 'متوسط',
    HARD = 'سخت',
}

export interface QuizHistoryItem {
    chapter: string;
    score: number;
    date: string;
    difficulty: Difficulty;
}