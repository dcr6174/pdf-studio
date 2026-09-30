CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`visitor_id` text NOT NULL,
	`kind` text NOT NULL,
	`tool_id` text,
	`received_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `analytics_events_time_kind_idx` ON `analytics_events` (`received_at`,`kind`);--> statement-breakpoint
CREATE TABLE `analytics_visitors` (
	`id` text PRIMARY KEY NOT NULL,
	`last_activity` integer NOT NULL,
	`last_visible` integer DEFAULT 0 NOT NULL,
	`tool_id` text,
	`rate_window` integer NOT NULL,
	`rate_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `analytics_visitors_activity_idx` ON `analytics_visitors` (`last_activity`);--> statement-breakpoint
CREATE INDEX `analytics_visitors_visible_idx` ON `analytics_visitors` (`last_visible`);