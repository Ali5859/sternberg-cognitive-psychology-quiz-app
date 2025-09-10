
import React from 'react';

interface LoaderProps {
    text: string;
}

const Loader: React.FC<LoaderProps> = ({ text }) => {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="w-16 h-16 border-4 border-cyan-400 border-dashed rounded-full animate-spin border-t-transparent mb-4"></div>
            <p className="text-xl text-slate-300 font-semibold">{text}</p>
        </div>
    );
};

export default Loader;
