import React, { useState } from 'react';
import { Chapter, Difficulty } from '../types';
import { CHAPTERS, DIFFICULTIES } from '../constants';
import SparklesIcon from './icons/SparklesIcon';
import TargetIcon from './icons/TargetIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import BookmarkIcon from './icons/BookmarkIcon';
import CogIcon from './icons/CogIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

interface HomeScreenProps {
    onStartQuiz: (chapter: Chapter, difficulty: Difficulty) => void;
    onStartPractice: () => void;
    onShowStats: () => void;
    onShowBookmarks: () => void;
    onEditApiKey: () => void;
    practiceQuestionCount: number;
    bookmarkedQuestionCount: number;
    error: string | null;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartQuiz, onStartPractice, onShowStats, onShowBookmarks, onEditApiKey, practiceQuestionCount, bookmarkedQuestionCount, error, theme, onToggleTheme }) => {
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);

    return (
        <div className="relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full animate-fade-in transition-colors duration-500">
            <div className="absolute top-4 left-4 flex gap-2">
                 <button
                    onClick={onToggleTheme}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                </button>
                <button
                    onClick={onEditApiKey}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                    aria-label="Edit API Key"
                >
                    <CogIcon className="w-6 h-6" />
                </button>
            </div>
            <header className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <SparklesIcon className="w-8 h-8 text-cyan-400"/>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-fuchsia-500">
                        استاد روانشناسی شناختی
                    </h1>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-lg">فصل و سطح دشواری را برای شروع آزمون انتخاب کنید.</p>
            </header>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6 text-center">
                    <strong>خطا:</strong> {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {CHAPTERS.map((chapter) => (
                    <button
                        key={chapter.id}
                        onClick={() => setSelectedChapter(chapter)}
                        className={`p-6 rounded-xl text-right transition-all duration-300 ease-in-out transform hover:-translate-y-2 focus:outline-none focus:ring-4 ${
                            selectedChapter?.id === chapter.id
                                ? 'bg-cyan-500/10 dark:bg-cyan-500/20 border-2 border-cyan-400 ring-4 ring-cyan-500/50'
                                : 'bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        <chapter.icon className="w-8 h-8 mb-3 text-cyan-400" />
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">{chapter.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{chapter.description}</p>
                    </button>
                ))}
            </div>
            
             <div className="mb-8">
                <h3 className="text-lg font-semibold text-center text-slate-600 dark:text-slate-300 mb-4">سطح دشواری را انتخاب کنید</h3>
                <div className="flex justify-center items-center bg-slate-200 dark:bg-slate-700/50 p-1 rounded-full w-full max-w-sm mx-auto">
                    {DIFFICULTIES.map(difficulty => (
                        <button
                            key={difficulty.id}
                            onClick={() => setSelectedDifficulty(difficulty.id)}
                            className={`w-1/3 py-2 text-center font-semibold rounded-full transition-colors duration-300 focus:outline-none ${
                                selectedDifficulty === difficulty.id
                                    ? 'bg-cyan-500 text-white shadow-md'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-600/50'
                            }`}
                        >
                            {difficulty.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center justify-center gap-4">
                <button
                    onClick={() => selectedChapter && onStartQuiz(selectedChapter, selectedDifficulty)}
                    disabled={!selectedChapter}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    شروع آزمون
                </button>
                 <button
                    onClick={onStartPractice}
                    disabled={practiceQuestionCount === 0}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-fuchsia-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                >
                    <TargetIcon className="w-5 h-5"/>
                    تمرین ({practiceQuestionCount})
                </button>
                 <button
                    onClick={onShowBookmarks}
                    disabled={bookmarkedQuestionCount === 0}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-amber-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                >
                    <BookmarkIcon className="w-5 h-5"/>
                    نشان‌شده‌ها ({bookmarkedQuestionCount})
                </button>
                <button
                    onClick={onShowStats}
                    className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 px-8 rounded-lg shadow-md hover:bg-slate-300 dark:hover:bg-slate-600 transform hover:scale-105 transition-all duration-300"
                >
                    <ChartBarIcon className="w-5 h-5"/>
                    نمودار پیشرفت
                </button>
            </div>
        </div>
    );
};

export default HomeScreen;