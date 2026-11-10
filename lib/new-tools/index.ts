import type {NewTool} from './types';
import {pageTools} from './pages';
export const newTools:Record<string,NewTool>=Object.fromEntries([...pageTools].map(t=>[t.id,t]));
