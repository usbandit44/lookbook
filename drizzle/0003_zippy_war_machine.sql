CREATE TABLE `outfits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`items` text DEFAULT (json_array()) NOT NULL,
	`imgUrl` text NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`size` text,
	`imgUrl` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_items`("id", "name", "type", "size", "imgUrl") SELECT "id", "name", "type", "size", "imgUrl" FROM `items`;--> statement-breakpoint
DROP TABLE `items`;--> statement-breakpoint
ALTER TABLE `__new_items` RENAME TO `items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;