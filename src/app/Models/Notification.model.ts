export interface Notification {
	id: string;
	from?: string;
	type: "download" | "follow" | "update";
}
