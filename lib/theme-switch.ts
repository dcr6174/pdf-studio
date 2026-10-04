export type Theme='light'|'dark';

export type ThemeDeps={
 /** the theme that is on the page right now */
 read:()=>Theme;
 /** put a theme on the page */
 write:(t:Theme)=>void;
 /** update the button (icon and label) */
 commit:(t:Theme)=>void;
 /** remember the choice */
 persist:(t:Theme)=>void;
 /** run `run` now, or inside an animated transition when the visible theme will really change */
 animate:(run:()=>void,from:Element|null,changes:boolean)=>void;
};

/**
 * Keeps fast clicks honest.
 * The page only changes a moment AFTER a click (it waits for the transition), so the visible theme
 * and the button state can be out of date while someone is clicking quickly. The controller therefore
 * remembers the theme the person LAST ASKED FOR, flips that on every press, and every scheduled change
 * applies that latest wish, whatever order the transitions happen to finish in.
 * Two quick presses end where they started; three end on the other theme; none is ever lost.
 */
export function createThemeController(deps:ThemeDeps){
 let target:Theme=deps.read();
 const apply=()=>{deps.write(target);deps.commit(target);};
 const go=(from:Element|null)=>deps.animate(apply,from,deps.read()!==target);
 return {
  get target(){return target;},
  /** The person pressed the button. */
  toggle(from:Element|null=null):Theme{target=target==='dark'?'light':'dark';deps.persist(target);go(from);return target;},
  /** The device changed its light/dark setting (only used until the person has chosen). */
  follow(t:Theme){target=t;go(null);},
  /** First load: show the theme without any animation. */
  sync(t:Theme){target=t;apply();},
 };
}
