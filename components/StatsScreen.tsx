
import React, { useEffect, useState } from 'react';
import { QuizHistoryItem, Difficulty } from '../types';
import { CHAPTERS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import TrashIcon from './icons/TrashIcon';

interface StatsScreenProps {
    onHome: () => void;
    onReset: () => void;
    theme: 'light' | 'dark';
}

const StatsScreen: React.FC<StatsScreenProps> = ({ onHome, onReset, theme }) => {
    const [history, setHistory] = useState<QuizHistoryItem[]>([]);

    useEffect(() => {
        const storedHistory = localStorage.getItem('quizHistory');
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, []);

    const getChapterStats = () => {
        const stats: { [key: string]: { totalScore: number; count: number } } = {};
        
        history.forEach(item => {
            if (!stats[item.chapter]) {
                stats[item.chapter] = { totalScore: 0, count: 0 };
            }
            stats[item.chapter].totalScore += item.score;
            stats[item.chapter].count++;
        });

        return CHAPTERS.map(chapter => ({
            name: chapter.title.split(' ')[0], // Shorten name for chart
            'میانگین امتیاز': stats[chapter.title] ? Math.round(stats[chapter.title].totalScore / stats[chapter.title].count) : 0,
        })).filter(item => item['میانگین امتیاز'] > 0);
    };

    const getTimelineStats = () => {
        return history.map((item, index) => ({
            name: `آزمون ${index + 1}`,
            امتیاز: Math.round(item.score),
            date: new Date(item.date).toLocaleDateString('fa-IR'),
        }));
    };

    const getDifficultyStats = () => {
        const stats: { [key in Difficulty]?: { totalScore: number; count: number } } = {};
        history.forEach(item => {
            // For backward compatibility with old history items
            const difficulty = item.difficulty || Difficulty.MEDIUM;
            if (!stats[difficulty]) {
                stats[difficulty] = { totalScore: 0, count: 0 };
            }
            stats[difficulty]!.totalScore += item.score;
            stats[difficulty]!.count++;
        });

        return Object.entries(stats).map(([difficulty, data]) => ({
            name: difficulty,
            'میانگین امتیاز': Math.round(data.totalScore / data.count),
        }));
    };
    
    const chartColors = {
        tick: theme === 'dark' ? '#94a3b8' : '#475569',
        grid: theme === 'dark' ? '#475569' : '#e2e8f0',
        tooltip: {
            backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
            border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`
        },
        legend: theme === 'dark' ? '#e2e8f0' : '#334155'
    };

    const chapterData = getChapterStats();
    const timelineData = getTimelineStats();
    const difficultyData = getDifficultyStats();

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full animate-fade-in transition-colors duration-500" dir="rtl">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                    آمار و پیشرفت شما
                </h1>
                <button onClick={onHome} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center gap-1">
                     <span>بازگشت</span>
                    <ChevronLeftIcon className="w-5 h-5"/>
                </button>
            </header>

            {history.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-slate-500 dark:text-slate-400 text-lg">هنوز هیچ آزمونی ثبت نشده است.</p>
                </div>
            ) : (
                <div className="space-y-12">
                     <div>
                        <h2 className="text-xl font-semibold text-cyan-500 dark:text-cyan-400 mb-4">روند پیشرفت در طول زمان</h2>
                        <div className="w-full h-80 bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg transition-colors duration-500">
                             <ResponsiveContainer>
                                <LineChart data={timelineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                                    <XAxis dataKey="name" tick={{ fill: chartColors.tick }} />
                                    <YAxis tick={{ fill: chartColors.tick }} />
                                    <Tooltip contentStyle={chartColors.tooltip}/>
                                    <Legend wrapperStyle={{ color: chartColors.legend }} />
                                    <Line type="monotone" dataKey="امتیاز" stroke="#a855f7" strokeWidth={2} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold text-cyan-500 dark:text-cyan-400 mb-4">میانگین امتیاز بر اساس فصل</h2>
                            <div className="w-full h-80 bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg transition-colors duration-500">
                                <ResponsiveContainer>
                                    <BarChart data={chapterData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                                        <XAxis dataKey="name" tick={{ fill: chartColors.tick }} />
                                        <YAxis tick={{ fill: chartColors.tick }} />
                                        <Tooltip contentStyle={chartColors.tooltip}/>
                                        <Legend wrapperStyle={{ color: chartColors.legend }} />
                                        <Bar dataKey="میانگین امتیاز" fill="#22d3ee" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                         <div>
                            <h2 className="text-xl font-semibold text-cyan-500 dark:text-cyan-400 mb-4">میانگین امتیاز بر اساس سطح دشواری</h2>
                            <div className="w-full h-80 bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg transition-colors duration-500">
                                <ResponsiveContainer>
                                    <BarChart data={difficultyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                                        <XAxis dataKey="name" tick={{ fill: chartColors.tick }} />
                                        <YAxis tick={{ fill: chartColors.tick }} />
                                        <Tooltip contentStyle={chartColors.tooltip}/>
                                        <Legend wrapperStyle={{ color: chartColors.legend }} />
                                        <Bar dataKey="میانگین امتیاز" fill="#f472b6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 text-center transition-colors duration-500">
                <button
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 mx-auto bg-red-600 dark:bg-red-800/80 hover:bg-red-700 dark:hover:bg-red-700 text-white dark:text-red-200 font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                    <TrashIcon className="w-5 h-5"/>
                    <span>بازنشانی تمام پیشرفت‌ها</span>
                </button>
            </div>
        </div>
    );
};

export default StatsScreen;