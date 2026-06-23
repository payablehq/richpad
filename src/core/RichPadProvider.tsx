import { createContext, useContext } from 'react';
import type { RichPadContextValue } from './types';

const RichPadContext = createContext<RichPadContextValue>({
  editor: null,
  editable: true,
  readOnly: false,
  disabled: false,
});

export const RichPadContextProvider = RichPadContext.Provider;

export function useRichPadContext(): RichPadContextValue {
  const context = useContext(RichPadContext);
  if (!context) {
    throw new Error('useRichPadContext must be used within a RichPadProvider');
  }
  return context;
}

export { RichPadContext };
