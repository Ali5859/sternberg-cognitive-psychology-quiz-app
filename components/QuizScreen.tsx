
import React, { useState, useEffect, useCallback } from 'react';
import { Question, UserAnswer } from '../types';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import ClockIcon from './icons/ClockIcon';

interface QuizScreenProps {
    questions: Question[];
    onFinish: (answers: UserAnswer[]) => void;
    bookmarkedQuestions: Question[];
    onToggleBookmark: (question: Question) => void;
    duration: number;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinish, bookmarkedQuestions, onToggleBookmark, duration }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [timeLeft, setTimeLeft] = useState(duration);

    const handleFinishQuiz = useCallback(() => {
        onFinish(userAnswers);
    }, [onFinish, userAnswers]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleFinishQuiz();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [handleFinishQuiz]);

    const handleAnswer = (selectedAnswer: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = currentQuestion.correctAnswer === selectedAnswer;
        const answer: UserAnswer = {
            questionId: currentQuestion.id,
            selectedAnswer,
            isCorrect,
        };
        
        if (!userAnswers.some(a => a.questionId === answer.questionId)) {
            setUserAnswers(prev => [...prev, answer]);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            onFinish(userAnswers);
        }
    };
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const currentQuestion = questions[currentQuestionIndex];
    const isBookmarked = bookmarkedQuestions.some(bq => bq.id === currentQuestion.id);

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transition-colors duration-500">
            <header className="flex justify-between items-center mb-6">
                <div className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                    سوال {currentQuestionIndex + 1} از {questions.length}
                </div>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-full text-cyan-500 dark:text-cyan-400 font-bold">
                    <ClockIcon className="w-5 h-5"/>
                    <span>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>
                </div>
            </header>
            <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
            <div className="mt-8">
                <QuestionCard
                    key={currentQuestionIndex}
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    onNext={handleNext}
                    isLast={currentQuestionIndex === questions.length - 1}
                    isBookmarked={isBookmarked}
                    onToggleBookmark={() => onToggleBookmark(currentQuestion)}
                />
            </div>
        </div>
    );
};

export default QuizScreen;