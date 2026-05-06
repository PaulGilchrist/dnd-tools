import { createContext, useContext, useState } from 'react';
import { LOCAL_STORAGE_KEYS, getLocalStorageString, setLocalStorageString } from '../utils/localStorage';

const RuleVersionContext = createContext(null);

export function RuleVersionProvider({ children }) {
    const [ruleVersion, setRuleVersion] = useState(() => {
        return getLocalStorageString(LOCAL_STORAGE_KEYS.RULE_VERSION) || '5e';
    });

    const updateRuleVersion = (newVersion) => {
        setRuleVersion(newVersion);
        setLocalStorageString(LOCAL_STORAGE_KEYS.RULE_VERSION, newVersion);
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
