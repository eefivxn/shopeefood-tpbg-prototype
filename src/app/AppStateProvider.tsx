import { type ReactNode, useContext, useEffect, useMemo, useReducer } from 'react';
import { createContext } from 'react';
import { appReducer } from '../state/reducer';
import type { AppAction } from '../state/reducer';
import type { AppState } from '../types/state';
import { createStateFromStorage, savePersistedState, toPersisted } from '../state/persistence';
import type { MinimalStorage } from '../state/persistence';
import { getBrowserStorage } from './browserStorage';
import { createReceiptId } from '../lib/receiptId';

export interface IdTimeFactory {
  readonly createId: () => string;
  readonly createIso: () => string;
}

function defaultIdTimeFactory(): IdTimeFactory {
  return {
    createId: (): string => createReceiptId(() => Math.random().toString(36).slice(2, 10)),
    createIso: (): string => new Date().toISOString(),
  };
}

interface AppContextValue {
  readonly state: AppState;
  readonly dispatch: (action: AppAction) => void;
  readonly idTime: IdTimeFactory;
}

const AppContext = createContext<AppContextValue | null>(null);

export interface AppStateProviderProps {
  readonly children: ReactNode;
  readonly storage?: MinimalStorage | null;
  readonly idTime?: IdTimeFactory;
}

export function AppStateProvider({ children, storage, idTime }: AppStateProviderProps): JSX.Element {
  const resolvedStorage = useMemo(() => (storage === undefined ? getBrowserStorage() : storage), [storage]);
  const resolvedIdTime = useMemo(() => idTime ?? defaultIdTimeFactory(), [idTime]);
  const [state, dispatch] = useReducer(appReducer, resolvedStorage, createStateFromStorage);
  const serialized = JSON.stringify(toPersisted(state));

  useEffect(() => {
    savePersistedState(resolvedStorage, JSON.parse(serialized) as Parameters<typeof savePersistedState>[1]);
  }, [resolvedStorage, serialized]);

  const value = useMemo<AppContextValue>(() => ({ state, dispatch, idTime: resolvedIdTime }), [state, resolvedIdTime]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppContextValue {
  const ctx = useContext(AppContext);
  if (ctx === null) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
