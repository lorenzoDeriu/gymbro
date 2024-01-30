import { Injectable } from "@angular/core";
import { FirebaseService } from "./firebase.service";
import { Notification, NotificationType } from "../Models/Notification.model";
import { v4 as uuidv4 } from "uuid";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
	providedIn: "root",
})
export class NotificationService {
	private notifications: Notification[] = [];

	constructor(
		private firebase: FirebaseService,
		private snackBar: MatSnackBar
	) {
		this.retriveNotification();
	}

	public async retriveNotification() {
		this.firebase
			.getNotification()
			.then(async (notifications: Notification[]) => {
				this.notifications = await this.resolveUsername(notifications);
			});
	}

	private async resolveUsername(notifications: Notification[]) {
		for (let i = 0; i < notifications.length; i++) {
			notifications[i].username = await this.firebase.getUsername(
				notifications[i].from
			);
		}
		return notifications;
	}

	public getNotifications() {
		return this.notifications;
	}

	public async sendNotification(to: string, type: NotificationType) {
		const notification: Notification = {
			id: `ntf-${uuidv4()}`,
			from: await this.firebase.getUid(),
			type: type,
		};

		await this.firebase.addNotification(to, notification);
	}

	public async deleteNotification(id: string) {
		await this.firebase.deleteNotification(id);
		this.retriveNotification();
	}

	public async deleteAllNotifications() {
		await this.firebase.deleteAllNotifications();
		this.retriveNotification();
	}

	public async sendUpdateNotification() {
		await this.firebase.addNotification(await this.firebase.getUid(), {
			id: `ntf-${uuidv4()}`,
			type: "update",
		});
	}

	public async sendFeedbackNotification() {
		await this.firebase.addNotificationToAdmin();
	}

	public showSnackBarNotification(message: string, action: string, options?: MatSnackBarConfig) {
		this.snackBar.open(message, action, options);
	}
}