import {env} from 'cloudflare:workers';
export function analyticsDb(){if(!env.DB)throw new Error('Analytics database is unavailable.');return env.DB;}
export function analyticsOwnerEmail(){return env.ANALYTICS_OWNER_EMAIL;}
