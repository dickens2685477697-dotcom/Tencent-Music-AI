import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { CardStyle, LyricSegment, YinxinCandidate, YinxinDraft } from '../types/yinxin';

interface YinxinState {
  draft: YinxinDraft;
  candidates: YinxinCandidate[];
  selectedCandidate?: YinxinCandidate;
  selectedLyric?: LyricSegment;
  cardCopy: string;
  cardStyle: CardStyle;
  generation: number;
}

type Action =
  | { type: 'SET_DRAFT'; payload: Partial<YinxinDraft> }
  | { type: 'SET_CANDIDATES'; payload: YinxinCandidate[] }
  | { type: 'SELECT_CANDIDATE'; payload: YinxinCandidate }
  | { type: 'SET_LYRIC'; payload: LyricSegment }
  | { type: 'SET_COPY'; payload: string }
  | { type: 'SET_STYLE'; payload: CardStyle }
  | { type: 'REGENERATE' }
  | { type: 'START_REPLY'; payload: { message: string; shareId: string } };

const defaultDraft: YinxinDraft = {
  message: '',
  relationship: 'friend',
  scene: 'mixed',
  tone: 'sincere',
  createdAt: Date.now(),
  mode: 'create',
};

const initialState: YinxinState = {
  draft: defaultDraft,
  candidates: [],
  cardCopy: '',
  cardStyle: 'midnight',
  generation: 0,
};

function reducer(state: YinxinState, action: Action): YinxinState {
  switch (action.type) {
    case 'SET_DRAFT':
      return { ...state, draft: { ...state.draft, ...action.payload } };
    case 'SET_CANDIDATES':
      return { ...state, candidates: action.payload };
    case 'SELECT_CANDIDATE':
      return {
        ...state,
        selectedCandidate: action.payload,
        selectedLyric: action.payload.primaryLyric,
        cardCopy: action.payload.cardCopy,
        cardStyle: 'midnight',
      };
    case 'SET_LYRIC':
      return { ...state, selectedLyric: action.payload };
    case 'SET_COPY':
      return { ...state, cardCopy: action.payload };
    case 'SET_STYLE':
      return { ...state, cardStyle: action.payload };
    case 'REGENERATE':
      return { ...state, generation: state.generation + 1 };
    case 'START_REPLY':
      return {
        ...initialState,
        generation: state.generation,
        draft: {
          ...defaultDraft,
          message: action.payload.message,
          mode: 'reply',
          relationship: 'other',
          replyToShareId: action.payload.shareId,
          createdAt: Date.now(),
        },
      };
    default:
      return state;
  }
}

interface YinxinContextValue extends YinxinState {
  dispatch: React.Dispatch<Action>;
}

const YinxinContext = createContext<YinxinContextValue | null>(null);

export function YinxinProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ ...state, dispatch }), [state]);
  return <YinxinContext.Provider value={value}>{children}</YinxinContext.Provider>;
}

export function useYinxin() {
  const context = useContext(YinxinContext);
  if (!context) throw new Error('useYinxin must be used inside YinxinProvider');
  return context;
}

export function useDraftActions() {
  const { dispatch } = useYinxin();
  return useCallback((payload: Partial<YinxinDraft>) => dispatch({ type: 'SET_DRAFT', payload }), [dispatch]);
}
