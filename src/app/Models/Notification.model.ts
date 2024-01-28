export type NotificationType = "download" | "follow" | "update" | "feedback";

export interface Notification {
	id: string;
	from?: string;
	username?: string;
	type: NotificationType;
}
