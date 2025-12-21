'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { EnvironmentType } from '@/types';

interface EnvironmentContextProps {
    environment: EnvironmentType;
    setEnvironment: (env: EnvironmentType) => void;
}

export const EnvironmentContext = createContext<EnvironmentContextProps>({
    environment: 'Claude Code',
    setEnvironment: () => { },
});

export const EnvironmentProvider = ({ children }: { children?: ReactNode }) => {
    const [environment, setEnvironmentState] = useState<EnvironmentType>('Claude Code');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('skills-env') as EnvironmentType;
        if (stored && ['Claude Code', 'Claude.ai', 'API'].includes(stored)) {
            setEnvironmentState(stored);
        }
    }, []);

    const setEnvironment = (env: EnvironmentType) => {
        setEnvironmentState(env);
        localStorage.setItem('skills-env', env);
    };

    return (
        <EnvironmentContext.Provider value={{ environment, setEnvironment }}>
            {children}
        </EnvironmentContext.Provider>
    );
};

export const useEnvironment = () => useContext(EnvironmentContext);
