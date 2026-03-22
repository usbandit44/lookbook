PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`color` text,
	`size` text DEFAULT '',
	`imgUrl` text NOT NULL,
	`updateImgUrl` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_items`("id", "name", "type", "color", "size", "imgUrl", "updateImgUrl") SELECT "id", "name", "type", "color", "size", "imgUrl", "updateImgUrl" FROM `items`;--> statement-breakpoint
DROP TABLE `items`;--> statement-breakpoint
ALTER TABLE `__new_items` RENAME TO `items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;