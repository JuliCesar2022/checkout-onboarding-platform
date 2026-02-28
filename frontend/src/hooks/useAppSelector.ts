import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store/rootReducer';

/** Typed selector hook — use instead of plain useSelector */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
