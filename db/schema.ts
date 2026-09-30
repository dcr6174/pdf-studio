import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const analyticsVisitors=sqliteTable('analytics_visitors',{
 id:text('id').primaryKey(),lastActivity:integer('last_activity').notNull(),lastVisible:integer('last_visible').notNull().default(0),toolId:text('tool_id'),rateWindow:integer('rate_window').notNull(),rateCount:integer('rate_count').notNull().default(0),
},t=>[index('analytics_visitors_activity_idx').on(t.lastActivity),index('analytics_visitors_visible_idx').on(t.lastVisible)]);
export const analyticsEvents=sqliteTable('analytics_events',{
 id:text('id').primaryKey(),visitorId:text('visitor_id').notNull(),kind:text('kind').notNull(),toolId:text('tool_id'),receivedAt:integer('received_at').notNull(),
},t=>[index('analytics_events_time_kind_idx').on(t.receivedAt,t.kind)]);
