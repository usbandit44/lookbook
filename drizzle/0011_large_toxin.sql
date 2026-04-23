PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`color` text,
	`size` text,
	`tags` text DEFAULT (json_array()) NOT NULL,
	`imgUrl` text NOT NULL,
	`updateImgUrl` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_items`("id", "name", "type", "color", "size", "tags", "imgUrl", "updateImgUrl") SELECT "id", "name", "type", "color", "size", "tags", "imgUrl", "updateImgUrl" FROM `items`;--> statement-breakpoint
DROP TABLE `items`;--> statement-breakpoint
ALTER TABLE `__new_items` RENAME TO `items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
-- After
ALTER TABLE `user` ADD `customTags` text NOT NULL DEFAULT '[]';