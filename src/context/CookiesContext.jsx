import { createContext, useContext, useMemo, useState } from 'react';

const lsKey = 'cookies-config';

const initialState = {
    cookies: JSON.parse(localStorage.getItem(lsKey)) || {
        open: true,
        functional: false,
        analytics: false,
    },
    setCookies: () => {},
};

export const setAnaliticsStorage = (prevState, currState) => {
    if (
        prevState !== currState &&
        !window.location.href.includes('localhost')
    ) {
        window.gtag('consent', 'update', {
            analytics_storage: currState ? 'granted' : 'denied',
        });
    }
};

export const generateSetter = (open, functional, analytics) => {
    return (prevState) => {
        const newConfig = {
            ...prevState,
            open,
            functional,
            analytics,
        };
        localStorage.setItem(lsKey, JSON.stringify(newConfig));
        setAnaliticsStorage(prevState.analytics, analytics);
        return newConfig;
    };
};

const CookiesContext = createContext(initialState);

export const CookiesProvider = function ({ children }) {
    const [cookies, setCookies] = useState(initialState.cookies);

    const value = useMemo(() => ({ cookies, setCookies }), [cookies]);

    return (
        <CookiesContext.Provider value={value}>
            {children}
        </CookiesContext.Provider>
    );
};

const useCookies = () => {
    const context = useContext(CookiesContext);

    if (context === undefined) {
        throw new Error('useCookies must be used within a DataProvider');
    }

    return context;
};

export default useCookies;
