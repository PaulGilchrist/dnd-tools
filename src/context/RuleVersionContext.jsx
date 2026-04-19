import { createContext, useContext, useState, useEffect } from 'react';

const RuleVersionContext = createContext(null);

export function RuleVersionProvider({ children }) {
    const [ruleVersion, setRuleVersion] = useState('5e');

    useEffect(() => {
        const savedRuleVersion = localStorage.getItem('ruleVersion');
        if (savedRuleVersion) {
            setRuleVersion(savedRuleVersion);
        }
    }, []);

    const updateRuleVersion = (newVersion) => {
        setRuleVersion(newVersion);
        localStorage.setItem('ruleVersion', newVersion);
    };

    return (
        <RuleVersionContext.Provider value={{ ruleVersion, setRuleVersion: updateRuleVersion }}>
            {children}
        </RuleVersionContext.Provider>
    );
}

export function useRuleVersion() {
    const context = useContext(RuleVersionContext);
    if (!context) {
        throw new Error('useRuleVersion must be used within a RuleVersionProvider');
    }
    return context;
}