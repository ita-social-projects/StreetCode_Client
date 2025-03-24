import React, { createContext, useContext, useMemo, useState } from 'react';

type ViewMode = 'calendar' | 'listView' | 'dayView';

interface CalendarContextType {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const useCalendarContext = () => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error('useCalendarContext must be used within a CalendarProvider');
    }
    return context;
};

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');

    const contextValue = useMemo(() => ({
        viewMode,
        setViewMode,
    }), [viewMode]);

    return (
        <CalendarContext.Provider value={contextValue}>
            {children}
        </CalendarContext.Provider>
    );
};
