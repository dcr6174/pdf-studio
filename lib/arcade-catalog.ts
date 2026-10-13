export const arcadeGames = [
  {slug:'buddy-stack',name:'Buddy Stack',icon:'▰',color:'#bca2ff',genre:'Timing',description:'One tap. One block. How high can Buddy climb?',instructions:'Tap Drop or press Space when the moving block lines up. Perfect drops keep its width.',mode:'stack'},
  {slug:'paper-toss',name:'Paper Toss',icon:'✈',color:'#ffd08a',genre:'Aim',description:'A tiny bin. A little wind. One more throw.',instructions:'Tap the playfield to aim, then Throw. Watch the dotted flight path: wind changes after every throw.',mode:'toss'},
  {slug:'merge-2048',name:'Merge 2048',icon:'2048',color:'#ffad93',genre:'Puzzle',description:'Slide, combine, and chase that beautiful 2048.',instructions:'Swipe or use the arrow buttons/keys. Equal tiles merge once per move. Undo is available.',mode:'merge'},
  {slug:'bubble-pop',name:'Bubble Pop',icon:'●',color:'#f4a2e7',genre:'Aim',description:'Aim a colour. Match three. Clear the sky.',instructions:'Tap to aim, then Shoot. Match three touching bubbles of the same colour; clear every bubble to win.',mode:'bubbles'},
  {slug:'snake-sprint',name:'Snake Sprint',icon:'〰',color:'#a3e9ac',genre:'Arcade',description:'A familiar little snake with a very big appetite.',instructions:'Swipe, press arrow keys or use the direction pad. Eat fruit, grow, and avoid walls and yourself.',mode:'snake'},
  {slug:'memory-match',name:'Memory Match',icon:'✦',color:'#9de4eb',genre:'Puzzle',description:'Six pairs. Two flips. Trust your memory.',instructions:'Flip two cards to find a pair. Matched cards stay open. Finish with fewer moves for a better score.',mode:'memory'},
  {slug:'neon-breaker',name:'Neon Brick Breaker',icon:'▥',color:'#99baff',genre:'Arcade',description:'Keep the bounce alive. Smash every brick.',instructions:'Drag or tap to move the paddle; arrow keys and buttons work too. Break the bricks before losing three lives.',mode:'breaker'},
  {slug:'odd-one',name:'Tap the Odd One',icon:'◎',color:'#ffe78b',genre:'Quick',description:'One symbol does not belong. Find it fast.',instructions:'Choose the different symbol. You have 60 seconds; a wrong answer costs two seconds and one point.',mode:'odd'},
  {slug:'sliding-puzzle',name:'Sliding Puzzle',icon:'▦',color:'#cabaff',genre:'Puzzle',description:'Fifteen tiles. One space. A satisfying finish.',instructions:'Tap a tile next to the empty space, or use arrow keys to move the empty space. Every shuffle is solvable.',mode:'slide'},
  {slug:'buddy-runner',name:'Buddy Runner',icon:'➜',color:'#a7e5d1',genre:'Arcade',description:'Jump the obstacles. Let the good times roll.',instructions:'Tap Jump or press Space/Arrow Up. Clear obstacles and collect stars. Speed rises as you run.',mode:'runner'},
] as const;
export type ArcadeSlug = typeof arcadeGames[number]['slug'];
export type GameMode = typeof arcadeGames[number]['mode'];
export const arcadeGame = (slug:string) => arcadeGames.find(game=>game.slug===slug);
