import React, { useState } from 'react';
// FIX: Changed import from PracticeQuestion to Question to make the component more reusable, as it doesn't rely on SRS-specific properties.
import { Question } from '../types';
import QuestionCard from './QuestionCard';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

interface PracticeScreenProps {
    // FIX: Updated prop type to Question[] to accept any kind of question array, not just practice questions with SRS data.
    questions: Question[];
    onHome: () => void;
    onQuestionAnswered: (questionId: string, isCorrect: boolean) => void;
    title: string;
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({ questions, onHome, onQuestionAnswered, title }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(questions.length === 0);

    const handleAnswer = (selectedAnswer: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = currentQuestion.correctAnswer === selectedAnswer;
        onQuestionAnswered(currentQuestion.id, isCorrect);

        setTimeout(() => {
            // The list of questions for this session is fixed. We just iterate through it.
            // The parent component handles the SRS logic and state updates.
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setIsFinished(true);
            }
        }, 1500); // Allow user to see feedback before next question
    };

    const currentQuestion = questions[currentQuestionIndex];

    if (isFinished || !currentQuestion) {
        return (
            <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-fade-in transition-colors duration-500">
                <h2 className="text-3xl font-bold text-cyan-500 dark:text-cyan-400 mb-4">تمرین تمام شد!</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">شما تمام سوالات این بخش را مرور کردید.</p>
                <button
                    onClick={onHome}
                    className="flex items-center justify-center gap-2 mx-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                    بازگشت به خانه
                </button>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-fade-in transition-colors duration-500">
            <header className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-500">
                    {title}
                </h1>
                <button onClick={onHome} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center gap-1">
                    <span>بازگشت</span>
                    <ChevronLeftIcon className="w-5 h-5"/>
                </button>
            </header>
            <div className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-4">
                سوال {currentQuestionIndex + 1} از {questions.length}
            </div>
            <div className="mt-8">
                <QuestionCard
                    key={currentQuestion.id}
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                />
            </div>
        </div>
    );
};

export default PracticeScreen;
