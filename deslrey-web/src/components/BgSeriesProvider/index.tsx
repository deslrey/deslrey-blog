'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type BgSeriesType = 'sex' | 'pure' | 'scenery';

interface BgSeriesContextValue {
    series: BgSeriesType;
    setSeries: (series: BgSeriesType) => void;
}

const BgSeriesContext = createContext<BgSeriesContextValue>({
    series: 'scenery',
    setSeries: () => { },
});

export function useBgSeries() {
    return useContext(BgSeriesContext);
}

export default function BgSeriesProvider({ children }: { children: React.ReactNode }) {
    const [series, setSeries] = useState<BgSeriesType>('scenery');

    useEffect(() => {
        const saved = (localStorage.getItem('bgSeries') as BgSeriesType) || 'scenery';
        setSeries(saved);
    }, []);

    const handleSetSeries = (value: BgSeriesType) => {
        setSeries(value);
        localStorage.setItem('bgSeries', value);
    };

    return (
        <BgSeriesContext.Provider value={{ series, setSeries: handleSetSeries }}>
            {children}
        </BgSeriesContext.Provider>
    );
}
