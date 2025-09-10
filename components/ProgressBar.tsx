
import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
    const progressPercentage = (current / total) * 100;

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 transition-colors duration-500">
            <div
                className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;