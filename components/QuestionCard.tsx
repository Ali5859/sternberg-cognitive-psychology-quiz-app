
import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import BookmarkIcon from './icons/BookmarkIcon';

interface QuestionCardProps {
    question: Question;
    onAnswer: (selectedAnswer: string) => void;
    onNext?: () => void;
    isLast?: boolean;
    isBookmarked?: boolean;
    onToggleBookmark?: () => void;
    // This prop is for the simpler practice screen which auto-advances
    onAnswerSelect?: (selectedAnswer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
    question, 
    onAnswer, 
    onNext, 
    isLast, 
    isBookmarked, 
    onToggleBookmark,
    onAnswerSelect 
}) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showCard, setShowCard] = useState(false);

    useEffect(() => {
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowCard(true);
        // This cleanup function helps animate the question transition
        return () => setShowCard(false);
    }, [question]);

    const handleOptionClick = (option: string) => {
        if (isAnswered) return;
        
        setSelectedAnswer(option);
        setIsAnswered(true);

        if (onAnswer) {
            onAnswer(option);
        }
        // For practice screen backwards compatibility
        if (onAnswerSelect) {
            onAnswerSelect(option);
        }
    };

    const getOptionClass = (option: string) => {
        if (!isAnswered) {
            return 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200';
        }
        if (option === question.correctAnswer) {
            return 'bg-green-500/80 border-green-400 text-white';
        }
        if (option === selectedAnswer) {
            return 'bg-red-500/80 border-red-400 text-white';
        }
        return 'bg-slate-100 dark:bg-slate-700 opacity-50 text-slate-700 dark:text-slate-200';
    };

    return (
        <div className={`transition-all duration-500 ease-in-out ${showCard ? 'opacity-100 transform-none' : 'opacity-0 -translate-x-4'}`}>
            <div className="relative">
                <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-200 leading-relaxed pr-12">{question.questionText}</h2>
                {onToggleBookmark && (
                    <button 
                        onClick={onToggleBookmark} 
                        className={`absolute top-0 right-0 p-2 rounded-full transition-colors ${isBookmarked ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    >
                        <BookmarkIcon className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        disabled={isAnswered}
                        className={`p-4 rounded-lg text-right text-lg transition-all duration-300 border-2 border-transparent ${getOptionClass(option)} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {isAnswered && (
                <div className="mt-6 p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in transition-colors duration-500">
                    <h4 className="font-bold text-cyan-600 dark:text-cyan-400 mb-2">توضیح:</h4>
                    <p className="text-slate-700 dark:text-slate-300">{question.explanation}</p>
                    {onNext && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={onNext}
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300"
                            >
                                {isLast ? 'پایان آزمون' : 'سوال بعدی'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuestionCard;