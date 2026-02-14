'use client';

import React from 'react';

interface LogoProps {
    size?: number;
    className?: string;
    showText?: boolean;
    rounded?: boolean;
}

export function Logo({
    size = 40,
    className = '',
    showText = false,
    rounded = true
}: LogoProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div
                className={`overflow-hidden flex items-center justify-center shrink-0 ${rounded ? 'rounded-xl' : ''}`}
                style={{ width: size, height: size }}
            >
                <img
                    src="/logo.png"
                    alt="PrivateNest Logo"
                    className="w-full h-full object-cover"
                />
            </div>
            {showText && (
                <span className="text-xl font-bold text-navy-900 tracking-tight">
                    PrivateNest
                </span>
            )}
        </div>
    );
}
