/** Preview the current page assembly when no earlier enabled action needs to run. */
export function workflowPreviewOperation(steps:readonly string[]=[],disabled:readonly number[]=[]):'workflow'|'organize'{
 return steps.some((_,index)=>!disabled.includes(index))?'workflow':'organize';
}
