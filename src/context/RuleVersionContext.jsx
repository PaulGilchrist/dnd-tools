import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { LOCAL_STORAGE_KEYS, getLocalStorageString, setLocalStorageString } from '../utils/localStorage';

const RuleVersionContext = createContext(null);

export function RuleVersionProvider({ children }) {
    const [ruleVersion, setRuleVersion] = useState(() => {
        return getLocalStorageString(LOCAL_STORAGE_KEYS.RULE_VERSION) || '5e';
    });

    const updateRuleVersion = useCallback((newVersion) => {
        setRuleVersion(newVersion);
        setLocalStorageString(LOCAL_STORAGE_KEYS.RULE_VERSION, newVersion);
    }, []);

    const contextValue = useMemo(() => ({ ruleVersion, setRuleVersion: updateRuleVersion }), [ruleVersion, updateRuleVersion]);

    return (
        <RuleVersionContext.Provider value={contextValue}>
            {children}
        </RuleVersionContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRuleVersion() {
    const context = useContext(RuleVersionContext);
    if (!context) {
        throw new Error('useRuleVersion must be used within a RuleVersionProvider');
    }
    return context;
}
