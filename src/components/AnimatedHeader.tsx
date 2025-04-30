import React from 'react';

const AnimatedHeader: React.FC = () => {
    return (
        <div className="text-center pt-32 pb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
                <span className="inline-block animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    No
                </span>{' '}
                <span className="inline-block animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    more
                </span>{' '}
                <span className="relative inline-block">
                    <span className="relative z-10 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                        crappy
                    </span>
                    <span
                        className="absolute top-[60%] left-0 w-[180px] h-1.5 bg-red-500 animate-strikethrough opacity-0"
                        style={{ animationDelay: '1.0s' }}
                    />
                </span>
                {' '}
                <span className="inline-block animate-fade-in" style={{ animationDelay: '1.2s' }}>
                    generic
                </span>
                {' '}
                <span className="inline-block animate-fade-in" style={{ animationDelay: '1.7s' }}>
                    content.
                </span>
            </h1>
            <style jsx global>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes strikethrough {
                    0% {
                        opacity: 0;
                        transform: scaleX(0) translateY(-50%);
                    }
                    1% {
                        opacity: 1;
                    }
                    to {
                        opacity: 1;
                        transform: scaleX(1) translateY(-50%);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                    opacity: 0;
                }

                .animate-strikethrough {
                    animation: strikethrough 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AnimatedHeader; 