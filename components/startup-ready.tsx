'use client';
import {useEffect} from 'react';
/** Tells the startup guard (lib/startup-guard.ts) that the app's JavaScript is running. Renders nothing. */
export function StartupReady(){
 useEffect(()=>{document.documentElement.dataset.ready='1';document.getElementById('startup-guard')?.remove();},[]);
 return null;
}
