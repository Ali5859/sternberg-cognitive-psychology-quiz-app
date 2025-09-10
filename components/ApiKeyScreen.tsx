import React, { useState } from 'react';
import KeyIcon from './icons/KeyIcon';

interface ApiKeyScreenProps {
    onSave: (apiKey: string) => void;
    error?: string | null;
}

const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onSave, error }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onSave(apiKey.trim());
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl mx-auto animate-fade-in transition-colors duration-500">
            <header className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <KeyIcon className="w-8 h-8 text-amber-400" />
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                        تنظیم کلید API Gemini
                    </h1>
                </div>
            </header>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-lg mb-6 text-center">
                    <strong>خطا:</strong> {error}
                </div>
            )}
            
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg mb-6 text-slate-600 dark:text-slate-300 space-y-3 transition-colors duration-500">
                <p>برای استفاده از این برنامه، به یک کلید API از Google AI Studio نیاز دارید.</p>
                <ol className="list-decimal list-inside space-y-2 pr-4">
                    <li>به <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-500 dark:text-cyan-400 hover:underline">Google AI Studio</a> بروید.</li>
                    <li>روی دکمه "Create API key" کلیک کنید.</li>
                    <li>کلید ساخته شده را کپی کرده و در کادر زیر قرار دهید.</li>
                </ol>
                <p className="text-sm text-slate-500 dark:text-slate-400">کلید شما به صورت محلی در مرورگر شما ذخیره می‌شود و به هیچ سروری ارسال نخواهد شد.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="کلید API خود را اینجا وارد کنید"
                    className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white p-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-colors"
                    aria-label="Gemini API Key"
                    dir="ltr"
                />
                <button
                    type="submit"
                    disabled={!apiKey.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                >
                    ذخیره و ادامه
                </button>
            </form>
        </div>
    );
};

export default ApiKeyScreen;