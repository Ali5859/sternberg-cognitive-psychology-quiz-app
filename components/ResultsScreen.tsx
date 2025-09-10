
import React from 'react';
import { QuizResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface ResultsScreenProps {
    result: QuizResult;
    onRetry: () => void;
    onHome: () => void;
    onPractice: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onRetry, onHome, onPractice }) => {
    const correctCount = result.answers.filter(a => a.isCorrect).length;
    const incorrectCount = result.questions.length - correctCount;

    const data = [
        { name: 'درست', value: correctCount },
        { name: 'غلط', value: incorrectCount },
    ];
    const COLORS = ['#10B981', '#EF4444'];
    
    const scoreColorClass = result.score >= 80 ? 'text-green-500 dark:text-green-400' : result.score >= 50 ? 'text-yellow-500 dark:text-yellow-400' : 'text-red-500 dark:text-red-400';

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full animate-fade-in transition-colors duration-500" dir="rtl">
            <h1 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-fuchsia-500">نتایج آزمون</h1>
            
            <div className="flex flex-col md:flex-row items-center justify-around my-8">
                <div className="text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-lg">امتیاز شما:</p>
                    <p className={`text-7xl font-bold my-2 ${scoreColorClass}`}>{Math.round(result.score)}<span className="text-3xl">%</span></p>
                    <p className="text-slate-600 dark:text-slate-300 font-semibold">{correctCount} پاسخ صحیح از {result.questions.length}</p>
                </div>
                <div className="w-full md:w-1/3 h-56 mt-6 md:mt-0">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend formatter={(value) => <span className="text-slate-700 dark:text-white">{value}</span>}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg prose prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-headings:text-cyan-500 dark:prose-headings:text-cyan-400 text-right w-full max-w-none transition-colors duration-500">
                <div dangerouslySetInnerHTML={{ __html: result.analysis.replace(/\n/g, '<br />') }} />
            </div>

            <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-4">
                 <button
                    onClick={onRetry}
                    className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                    آزمون مجدد
                </button>
                 <button
                    onClick={onPractice}
                    className="w-full md:w-auto bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                    تمرین نقاط ضعف
                </button>
                <button
                    onClick={onHome}
                    className="w-full md:w-auto bg-slate-500 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                    بازگشت به خانه
                </button>
            </div>
        </div>
    );
};

export default ResultsScreen;