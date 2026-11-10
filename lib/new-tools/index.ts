import type {NewTool} from './types';
import {pageTools} from './pages';
import {editTools} from './edit';
export const newTools:Record<string,NewTool>=Object.fromEntries([...pageTools,...editTools].map(t=>[t.id,t]));
