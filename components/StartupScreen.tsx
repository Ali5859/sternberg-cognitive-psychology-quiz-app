import React, { useEffect } from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface StartupScreenProps {
    onAnimationEnd: () => void;
}

const StartupScreen: React.FC<StartupScreenProps> = ({ onAnimationEnd }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onAnimationEnd();
        }, 2500); // Duration of the animation

        return () => clearTimeout(timer);
    }, [onAnimationEnd]);

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
            <div className="animate-fade-in-zoom">
                <div className="flex flex-col items-center justify-center gap-4">
                    <SparklesIcon className="w-24 h-24 text-cyan-400" />
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                        استاد روانشناسی شناختی
                    </h1>
                </div>
            </div>
            <style>{`
                @keyframes fadeInZoom {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in-zoom {
                    animation: fadeInZoom 2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default StartupScreen;