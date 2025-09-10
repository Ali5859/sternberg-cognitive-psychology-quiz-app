import React, { useState, useCallback, useEffect } from 'react';
import { AppState, Chapter, Question, QuizResult, UserAnswer, Difficulty } from './types';
import { QUIZ_QUESTION_COUNT, QUIZ_DURATIONS } from './constants';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import Loader from './components/Loader';
import { generateQuizQuestions, getPerformanceAnalysis } from './services/geminiService';
import PracticeScreen from './components/PracticeScreen';
import StatsScreen from './components/StatsScreen';
import StartupScreen from './components/StartupScreen';
import ApiKeyScreen from './components/ApiKeyScreen';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>(AppState.STARTUP);
    const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('geminiApiKey'));
    const [theme, setTheme] = useState<Theme>('dark');
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
    const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Question[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [quizDuration, setQuizDuration] = useState<number>(QUIZ_DURATIONS[Difficulty.MEDIUM]);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const handleToggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        const storedPracticeQuestions = localStorage.getItem('practiceQuestions');
        if (storedPracticeQuestions) {
            setPracticeQuestions(JSON.parse(storedPracticeQuestions));
        }
        const storedBookmarkedQuestions = localStorage.getItem('bookmarkedQuestions');
        if (storedBookmarkedQuestions) {
            setBookmarkedQuestions(JSON.parse(storedBookmarkedQuestions));
        }
    }, []);

    const handleStartupFinish = useCallback(() => {
        if (apiKey) {
            setAppState(AppState.HOME);
        } else {
            setAppState(AppState.API_KEY_SETUP);
        }
    }, [apiKey]);

    const handleSaveApiKey = (key: string) => {
        localStorage.setItem('geminiApiKey', key);
        setApiKey(key);
        setAppState(AppState.HOME);
    };

    const handleStartQuiz = useCallback(async (chapter: Chapter, difficulty: Difficulty) => {
        setSelectedChapter(chapter);
        setSelectedDifficulty(difficulty);
        setQuizDuration(QUIZ_DURATIONS[difficulty]);
        setAppState(AppState.LOADING_QUIZ);
        setError(null);
        try {
            const fetchedQuestions = await generateQuizQuestions(chapter.title, difficulty);
            if (fetchedQuestions.length < QUIZ_QUESTION_COUNT) {
                 throw new Error("Could not generate enough questions. Please try again.");
            }
            setQuestions(fetchedQuestions);
            setAppState(AppState.QUIZ);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while fetching questions.';
            if (errorMessage.includes("API Key")) {
                setError("کلید API شما نامعتبر است یا یافت نشد. لطفاً آن را در تنظیمات بررسی کنید.");
                setAppState(AppState.API_KEY_SETUP);
            } else {
                setError(errorMessage);
                setAppState(AppState.HOME);
            }
        }
    }, []);
    
    const handleFinishQuiz = useCallback(async (answers: UserAnswer[]) => {
        setAppState(AppState.LOADING_ANALYSIS);
        setError(null);
        
        const correctAnswers = answers.filter(a => a.isCorrect).length;
        const score = (correctAnswers / questions.length) * 100;
        
        const incorrectQuestions = questions.filter(q => 
            !answers.find(a => a.questionId === q.id)?.isCorrect
        );
        
        const updatedPracticeQuestions = [...practiceQuestions];
        incorrectQuestions.forEach(iq => {
            if(!updatedPracticeQuestions.some(pq => pq.id === iq.id)) {
                updatedPracticeQuestions.push(iq);
            }
        });
        setPracticeQuestions(updatedPracticeQuestions);
        localStorage.setItem('practiceQuestions', JSON.stringify(updatedPracticeQuestions));

        const historyItem = { chapter: selectedChapter!.title, score, date: new Date().toISOString(), difficulty: selectedDifficulty! };
        const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        history.push(historyItem);
        localStorage.setItem('quizHistory', JSON.stringify(history));

        try {
            const analysis = await getPerformanceAnalysis(questions, answers, selectedChapter!.title);
            const result: QuizResult = { score, answers, questions, analysis };
            setQuizResult(result);
            setAppState(AppState.RESULTS);
        } catch (err) {
            console.error(err);
            const result: QuizResult = { score, answers, questions, analysis: "متاسفانه تحلیل عملکرد شما با خطا مواجه شد. لطفا دوباره تلاش کنید." };
            setQuizResult(result);
            setAppState(AppState.RESULTS);
        }
    }, [questions, practiceQuestions, selectedChapter, selectedDifficulty]);

    const handleRetryQuiz = useCallback(() => {
        if (selectedChapter && selectedDifficulty) {
            handleStartQuiz(selectedChapter, selectedDifficulty);
        }
    }, [selectedChapter, selectedDifficulty, handleStartQuiz]);
    
    const handleGoHome = useCallback(() => {
        setAppState(AppState.HOME);
        setQuizResult(null);
        setSelectedChapter(null);
        setSelectedDifficulty(null);
        setQuestions([]);
        setError(null);
    }, []);

    const handleStartPractice = useCallback(() => {
        if(practiceQuestions.length > 0) {
            setAppState(AppState.PRACTICE);
        }
    }, [practiceQuestions]);
    
    const handleShowBookmarks = useCallback(() => {
        if (bookmarkedQuestions.length > 0) {
            setAppState(AppState.BOOKMARKS);
        }
    }, [bookmarkedQuestions]);
    
    const handleToggleBookmark = (question: Question) => {
        const isBookmarked = bookmarkedQuestions.some(bq => bq.id === question.id);
        const updated = isBookmarked
            ? bookmarkedQuestions.filter(bq => bq.id !== question.id)
            : [...bookmarkedQuestions, question];
        
        setBookmarkedQuestions(updated);
        localStorage.setItem('bookmarkedQuestions', JSON.stringify(updated));
    };

    const handleRemoveFromPractice = (questionId: string) => {
        const updated = practiceQuestions.filter(q => q.id !== questionId);
        setPracticeQuestions(updated);
        localStorage.setItem('practiceQuestions', JSON.stringify(updated));
    };

    const handleRemoveFromBookmarks = (questionId: string) => {
        const updated = bookmarkedQuestions.filter(q => q.id !== questionId);
        setBookmarkedQuestions(updated);
        localStorage.setItem('bookmarkedQuestions', JSON.stringify(updated));
    };
    
    const handleResetProgress = () => {
        if (window.confirm("آیا از بازنشانی تمام پیشرفت خود مطمئن هستید؟ این عمل قابل بازگشت نیست.")) {
            localStorage.removeItem('quizHistory');
            localStorage.removeItem('practiceQuestions');
            localStorage.removeItem('bookmarkedQuestions');
            setPracticeQuestions([]);
            setBookmarkedQuestions([]);
            handleGoHome();
        }
    };
    
    const renderContent = () => {
        switch (appState) {
            case AppState.STARTUP:
                return <StartupScreen onAnimationEnd={handleStartupFinish} />;
            case AppState.API_KEY_SETUP:
                return <ApiKeyScreen onSave={handleSaveApiKey} error={error} />;
            case AppState.LOADING_QUIZ:
                return <Loader text="...در حال آماده‌سازی سوالات" />;
            case AppState.LOADING_ANALYSIS:
                return <Loader text="...در حال تحلیل عملکرد شما" />;
            case AppState.QUIZ:
                return <QuizScreen 
                    questions={questions} 
                    onFinish={handleFinishQuiz}
                    bookmarkedQuestions={bookmarkedQuestions}
                    onToggleBookmark={handleToggleBookmark}
                    duration={quizDuration}
                />;
            case AppState.RESULTS:
                return quizResult && <ResultsScreen result={quizResult} onRetry={handleRetryQuiz} onHome={handleGoHome} onPractice={handleStartPractice}/>;
            case AppState.PRACTICE:
                return <PracticeScreen 
                    questions={practiceQuestions} 
                    onHome={handleGoHome} 
                    onQuestionCorrect={handleRemoveFromPractice}
                    title="تمرین نقاط ضعف"
                />;
            case AppState.BOOKMARKS:
                 return <PracticeScreen 
                    questions={bookmarkedQuestions} 
                    onHome={handleGoHome} 
                    onQuestionCorrect={handleRemoveFromBookmarks}
                    title="سوالات نشان شده"
                />;
            case AppState.STATS:
                return <StatsScreen onHome={handleGoHome} onReset={handleResetProgress} theme={theme} />;
            case AppState.HOME:
            default:
                return <HomeScreen 
                    onStartQuiz={handleStartQuiz} 
                    onStartPractice={handleStartPractice} 
                    onShowStats={() => setAppState(AppState.STATS)} 
                    onShowBookmarks={handleShowBookmarks}
                    onEditApiKey={() => { setError(null); setAppState(AppState.API_KEY_SETUP); }}
                    practiceQuestionCount={practiceQuestions.length}
                    bookmarkedQuestionCount={bookmarkedQuestions.length} 
                    error={error} 
                    theme={theme}
                    onToggleTheme={handleToggleTheme}
                />;
        }
    };

    return (
        <main className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500" dir="rtl">
            <div className="w-full max-w-4xl mx-auto">
                {renderContent()}
            </div>
        </main>
    );
};

export default App;