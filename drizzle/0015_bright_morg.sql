CREATE TABLE `presets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`preset` text DEFAULT '{}' NOT NULL,
	`favorited` integer DEFAULT false
);
