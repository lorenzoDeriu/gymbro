export type NotificationType = "download" | "follow" | "update";

export interface Notification {
	id: string;
	from?: string;
	type: NotificationType;
}
