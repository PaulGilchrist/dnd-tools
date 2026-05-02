import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { RuleVersionProvider, useRuleVersion } from './RuleVersionContext';
import * as localStorage from '../utils/localStorage';

vi.mock('../utils/localStorage', () => ({
    LOCAL_STORAGE_KEYS: {
        RULE_VERSION: 'ruleVersion'
    },
    getLocalStorageString: vi.fn(() => null),
    setLocalStorageString: vi.fn()
}));

describe('RuleVersionContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('useRuleVersion', () => {
        it('throws when used outside provider', () => {
            function TestConsumer() {
                useRuleVersion();
                return null;
            }
            expect(() => render(<TestConsumer />)).toThrow(
                'useRuleVersion must be used within a RuleVersionProvider'
            );
        });
    });

    describe('RuleVersionProvider', () => {
        function TestConsumer() {
            const { ruleVersion, setRuleVersion } = useRuleVersion();
            return (
                <div>
                    <div data-testid="version">{ruleVersion}</div>
                    <button onClick={() => setRuleVersion('2024')}>Update</button>
                </div>
            );
        }

        it('defaults rule version to 5e', () => {
            render(
                <RuleVersionProvider>
                    <TestConsumer />
                </RuleVersionProvider>
            );
            expect(screen.getByTestId('version')).toHaveTextContent('5e');
        });

        it('loads saved rule version from localStorage on mount', () => {
            localStorage.getLocalStorageString.mockReturnValue('2024');
            render(
                <RuleVersionProvider>
                    <TestConsumer />
                </RuleVersionProvider>
            );
            expect(screen.getByTestId('version')).toHaveTextContent('2024');
        });

        it('does not override default when localStorage returns null', () => {
            localStorage.getLocalStorageString.mockReturnValue(null);
            render(
                <RuleVersionProvider>
                    <TestConsumer />
                </RuleVersionProvider>
            );
            expect(screen.getByTestId('version')).toHaveTextContent('5e');
        });

        it('does not override default when localStorage returns empty string', () => {
            localStorage.getLocalStorageString.mockReturnValue('');
            render(
                <RuleVersionProvider>
                    <TestConsumer />
                </RuleVersionProvider>
            );
            expect(screen.getByTestId('version')).toHaveTextContent('5e');
        });

        it('does not override default when localStorage returns undefined', () => {
            localStorage.getLocalStorageString.mockReturnValue(undefined);
            render(
                <RuleVersionProvider>
                    <TestConsumer />
                </RuleVersionProvider>
            );
            expect(screen.getByTestId('version')).toHaveTextContent('5e');
        });

        it('updates rule version and saves to localStorage', () => {
            render(
                <RuleVersionProvider>
                    <TestConsumer />
                </RuleVersionProvider>
            );
            expect(screen.getByTestId('version')).toHaveTextContent('5e');

            act(() => {
                screen.getByText('Update').click();
            });

            expect(screen.getByTestId('version')).toHaveTextContent('2024');
            expect(localStorage.setLocalStorageString).toHaveBeenCalledWith('ruleVersion', '2024');
        });

        it('reads from localStorage only once on mount', () => {
            localStorage.getLocalStorageString.mockReturnValue(null);
            render(
                <RuleVersionProvider>
                    <TestConsumer />
                </RuleVersionProvider>
            );
            expect(localStorage.getLocalStorageString).toHaveBeenCalledTimes(1);
            expect(localStorage.getLocalStorageString).toHaveBeenCalledWith('ruleVersion');
        });

        it('can update to multiple different versions', () => {
            function TestMultiUpdate() {
                const { ruleVersion, setRuleVersion } = useRuleVersion();
                return (
                    <div>
                        <div data-testid="version">{ruleVersion}</div>
                        <button onClick={() => setRuleVersion('2024')}>To 2024</button>
                        <button onClick={() => setRuleVersion('5e')}>To 5e</button>
                    </div>
                );
             }
            render(
                <RuleVersionProvider>
                    <TestMultiUpdate />
                </RuleVersionProvider>
            );

            act(() => {
                screen.getByText('To 2024').click();
             });
            expect(screen.getByTestId('version')).toHaveTextContent('2024');

            act(() => {
                screen.getByText('To 5e').click();
             });
            expect(screen.getByTestId('version')).toHaveTextContent('5e');
            expect(localStorage.setLocalStorageString).toHaveBeenCalledTimes(2);
          });

        it('exposes setRuleVersion for direct updates', () => {
            let setterRef = null;
            function TestWithSetter() {
                const { setRuleVersion } = useRuleVersion();
                setterRef = setRuleVersion;
                return null;
            }
            render(
                <RuleVersionProvider>
                    <TestWithSetter />
                </RuleVersionProvider>
            );
            expect(typeof setterRef).toBe('function');
        });
    });
});
