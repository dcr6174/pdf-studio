import type {NewTool} from './types';
import {pageTools} from './pages';
import {editTools} from './edit';
import {convertTools} from './convert';
export const newTools:Record<string,NewTool>=Object.fromEntries([...pageTools,...editTools,...convertTools].map(t=>[t.id,t]));
